<?php
/**
 * TechWiz Release Updater Dashboard for aaPanel
 * Standalone Release Deployment & Auto-Updater Tool
 * Supports GitHub Releases, Zipball unwrapping, Env preservation, Build & PM2 restart
 */

error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', 0);
ini_set('max_execution_time', 600);
ini_set('memory_limit', '512M');

session_start();

$configFile = __DIR__ . '/config.json';
if (!file_exists($configFile)) {
    file_put_contents($configFile, json_encode([
        'secret_key' => 'techwiz2026@secure',
        'github_repo' => 'manhconne/techwiz-frontend',
        'github_token' => '',
        'target_dir' => dirname(__DIR__),
        'backup_dir' => dirname(__DIR__) . '_backups',
        'preserve_files' => ['.env', '.env.local', '.env.production', 'updater'],
        'build_command' => 'npm install && npm run build',
        'pm2_process_name' => 'techwiz-frontend',
        'auto_restart_pm2' => true,
        'max_backups' => 3
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$config = json_decode(file_get_contents($configFile), true) ?: [];

// Helper functions
function checkAuth($config) {
    if (empty($config['secret_key'])) return true;
    if (isset($_SESSION['updater_auth']) && $_SESSION['updater_auth'] === true) return true;
    $providedKey = $_GET['secret_key'] ?? $_POST['secret_key'] ?? $_SERVER['HTTP_X_SECRET_KEY'] ?? '';
    if ($providedKey === $config['secret_key']) {
        $_SESSION['updater_auth'] = true;
        return true;
    }
    return false;
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function sendSSE($event, $data) {
    echo "event: {$event}\n";
    echo "data: " . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n\n";
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
}

function githubApiRequest($url, $token) {
    $ch = curl_init();
    $headers = [
        'User-Agent: TechWiz-Updater-aaPanel',
        'Accept: application/vnd.github.v3+json'
    ];
    if (!empty($token)) {
        $headers[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => $response, 'error' => $err];
}

function downloadGithubZip($url, $token, $destinationPath) {
    // 1st request without auto-following location to catch redirect safely without AWS S3 Auth header clash
    $ch = curl_init();
    $headers = [
        'User-Agent: TechWiz-Updater-aaPanel',
        'Accept: application/vnd.github.v3+json'
    ];
    if (!empty($token)) {
        $headers[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $downloadUrl = $url;
    $useAuth = true;

    if ($httpCode === 301 || $httpCode === 302) {
        $headerText = substr($response, 0, $headerSize);
        if (preg_match('/Location:\s*([^\r\n]+)/i', $headerText, $matches)) {
            $downloadUrl = trim($matches[1]);
            // If redirected to Amazon S3 / objects.githubusercontent.com, do NOT send GitHub Bearer token
            if (strpos($downloadUrl, 'githubusercontent.com') !== false || strpos($downloadUrl, 'amazonaws.com') !== false) {
                $useAuth = false;
            }
        }
    }

    $fp = fopen($destinationPath, 'w+');
    if (!$fp) return false;

    $ch2 = curl_init();
    $headers2 = ['User-Agent: TechWiz-Updater-aaPanel'];
    if ($useAuth && !empty($token)) {
        $headers2[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch2, CURLOPT_URL, $downloadUrl);
    curl_setopt($ch2, CURLOPT_FILE, $fp);
    curl_setopt($ch2, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers2);
    curl_setopt($ch2, CURLOPT_TIMEOUT, 300);
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    $success = curl_exec($ch2);
    $statusCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    fclose($fp);

    return ($success && $statusCode >= 200 && $statusCode < 300);
}

// ---------------- API HANDLERS ----------------
$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $pass = $_POST['password'] ?? '';
    if (!empty($config['secret_key']) && $pass === $config['secret_key']) {
        $_SESSION['updater_auth'] = true;
        sendJson(['success' => true, 'message' => 'Đăng nhập thành công!']);
    } else if (empty($config['secret_key'])) {
        $_SESSION['updater_auth'] = true;
        sendJson(['success' => true, 'message' => 'Đăng nhập thành công (không có mật khẩu)']);
    }
    sendJson(['success' => false, 'message' => 'Sai mật khẩu truy cập!'], 401);
}

if ($action === 'logout') {
    unset($_SESSION['updater_auth']);
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

if ($action && !checkAuth($config)) {
    sendJson(['success' => false, 'message' => 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn.'], 403);
}

// Get current system status
if ($action === 'status') {
    $targetDir = realpath($config['target_dir']) ?: $config['target_dir'];
    $currentVersion = 'Chưa xác định';
    
    if (file_exists($targetDir . '/.current_version')) {
        $currentVersion = trim(file_get_contents($targetDir . '/.current_version'));
    } elseif (file_exists($targetDir . '/package.json')) {
        $pkg = json_decode(file_get_contents($targetDir . '/package.json'), true);
        $currentVersion = $pkg['version'] ?? 'Chưa xác định';
    }

    $isWritable = is_dir($targetDir) && is_writable($targetDir);
    
    // Check commands
    $nodeVer = @shell_exec('node -v 2>&1') ?: 'Chưa cài đặt';
    $npmVer = @shell_exec('npm -v 2>&1') ?: 'Chưa cài đặt';
    $pm2Ver = @shell_exec('pm2 -v 2>&1') ?: 'Chưa cài đặt';
    
    // Check pm2 status for target
    $pm2Status = 'Không rõ';
    if ($pm2Ver !== 'Chưa cài đặt' && !empty($config['pm2_process_name'])) {
        $pm2Check = @shell_exec("pm2 jlist 2>&1");
        if ($pm2Check && ($list = json_decode($pm2Check, true))) {
            $found = false;
            foreach ($list as $proc) {
                if ($proc['name'] === $config['pm2_process_name']) {
                    $pm2Status = $proc['pm2_env']['status'] ?? 'unknown';
                    $found = true;
                    break;
                }
            }
            if (!$found) $pm2Status = 'Chưa đăng ký PM2';
        }
    }

    sendJson([
        'success' => true,
        'current_version' => $currentVersion,
        'target_dir' => $targetDir,
        'target_dir_exists' => is_dir($targetDir),
        'target_dir_writable' => $isWritable,
        'node_version' => trim($nodeVer),
        'npm_version' => trim($npmVer),
        'pm2_version' => trim($pm2Ver),
        'pm2_status' => $pm2Status,
        'config' => [
            'github_repo' => $config['github_repo'],
            'has_token' => !empty($config['github_token']),
            'pm2_process_name' => $config['pm2_process_name'],
            'build_command' => $config['build_command'],
            'preserve_files' => $config['preserve_files'] ?? []
        ]
    ]);
}

// Fetch GitHub Releases
if ($action === 'releases') {
    $repo = trim($config['github_repo']);
    if (empty($repo)) {
        sendJson(['success' => false, 'message' => 'Chưa cấu hình github_repo!'], 400);
    }
    $res = githubApiRequest("https://api.github.com/repos/{$repo}/releases?per_page=15", $config['github_token']);
    if ($res['code'] !== 200) {
        $errData = json_decode($res['body'], true);
        $errMsg = $errData['message'] ?? ($res['error'] ?: 'Lỗi gọi GitHub API (' . $res['code'] . ')');
        sendJson(['success' => false, 'message' => $errMsg, 'raw' => $res['body']], 500);
    }
    $releases = json_decode($res['body'], true) ?: [];
    sendJson(['success' => true, 'releases' => $releases]);
}

// Save Config
if ($action === 'save_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'message' => 'Dữ liệu cấu hình không hợp lệ!'], 400);
    }
    
    // Merge updates
    foreach (['github_repo', 'target_dir', 'backup_dir', 'build_command', 'pm2_process_name', 'secret_key'] as $key) {
        if (isset($input[$key])) {
            $config[$key] = trim($input[$key]);
        }
    }
    if (isset($input['github_token']) && $input['github_token'] !== '******') {
        $config['github_token'] = trim($input['github_token']);
    }
    if (isset($input['auto_restart_pm2'])) {
        $config['auto_restart_pm2'] = (bool)$input['auto_restart_pm2'];
    }
    if (isset($input['preserve_files']) && is_array($input['preserve_files'])) {
        $config['preserve_files'] = array_values(array_filter(array_map('trim', $input['preserve_files'])));
    }

    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    sendJson(['success' => true, 'message' => 'Lưu cấu hình thành công!']);
}

// Perform Live Update with SSE Stream
if ($action === 'perform_update') {
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');
    header('Connection: keep-alive');
    header('X-Accel-Buffering: no'); // Disable FastCGI buffer on aaPanel Nginx

    $tag = $_GET['tag'] ?? 'latest';
    $skipBuild = isset($_GET['skip_build']) && $_GET['skip_build'] === '1';
    $targetDir = realpath($config['target_dir']) ?: $config['target_dir'];
    $backupDir = $config['backup_dir'] ?? ($targetDir . '_backups');
    $repo = $config['github_repo'];
    $token = $config['github_token'];

    sendSSE('log', ['type' => 'info', 'text' => "🚀 Bắt đầu tiến trình cập nhật phiên bản: [{$tag}]..."]);

    // 1. Resolve release info
    sendSSE('step', ['step' => 1, 'text' => 'Truy vấn thông tin Release từ GitHub...']);
    $releaseUrl = ($tag === 'latest') 
        ? "https://api.github.com/repos/{$repo}/releases/latest"
        : "https://api.github.com/repos/{$repo}/releases/tags/{$tag}";

    $relRes = githubApiRequest($releaseUrl, $token);
    if ($relRes['code'] !== 200) {
        sendSSE('log', ['type' => 'error', 'text' => "❌ Không lấy được thông tin release {$tag}. Mã lỗi: {$relRes['code']}"]);
        sendSSE('finish', ['success' => false]);
        exit;
    }

    $relData = json_decode($relRes['body'], true);
    $actualTag = $relData['tag_name'] ?? $tag;
    $zipballUrl = $relData['zipball_url'] ?? "https://api.github.com/repos/{$repo}/zipball/{$actualTag}";
    
    // Check if there is an asset that ends with .zip (custom build asset)
    if (!empty($relData['assets'])) {
        foreach ($relData['assets'] as $asset) {
            if (substr($asset['name'], -4) === '.zip') {
                $zipballUrl = $asset['browser_download_url'];
                sendSSE('log', ['type' => 'info', 'text' => "📦 Tìm thấy tệp asset đính kèm: {$asset['name']}"]);
                break;
            }
        }
    }

    sendSSE('log', ['type' => 'success', 'text' => "✅ Đã xác định phiên bản [{$actualTag}] (Tên: " . ($relData['name'] ?? $actualTag) . ")"]);

    // 2. Backup current directory
    if (!empty($config['max_backups']) && $config['max_backups'] > 0 && is_dir($targetDir)) {
        sendSSE('step', ['step' => 2, 'text' => 'Tạo bản sao lưu dự phòng (Backup)...']);
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
        }
        $backupFile = rtrim($backupDir, '/') . '/backup_' . date('Ymd_His') . '_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $actualTag) . '.tar.gz';
        $cmdBackup = "tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf " . escapeshellarg($backupFile) . " -C " . escapeshellarg($targetDir) . " . 2>&1";
        @exec($cmdBackup, $bOutput, $bCode);
        if ($bCode === 0) {
            sendSSE('log', ['type' => 'success', 'text' => "✅ Bản sao lưu đã lưu: " . basename($backupFile)]);
        } else {
            sendSSE('log', ['type' => 'warn', 'text' => "⚠️ Không tạo được bản nén backup (bỏ qua): " . implode(' ', $bOutput)]);
        }
    }

    // 3. Preserve critical environment files
    sendSSE('step', ['step' => 3, 'text' => 'Bảo vệ các tệp cấu hình môi trường (.env, .env.local...)...']);
    $tempEnvDir = sys_get_temp_dir() . '/techwiz_env_' . time();
    @mkdir($tempEnvDir, 0777, true);
    $preservedList = $config['preserve_files'] ?? ['.env', '.env.local', '.env.production', 'updater'];
    $savedPreserved = [];

    foreach ($preservedList as $item) {
        $sourcePath = rtrim($targetDir, '/') . '/' . ltrim($item, '/');
        if (file_exists($sourcePath)) {
            $destPath = $tempEnvDir . '/' . ltrim($item, '/');
            if (is_dir($sourcePath)) {
                // Ignore updater dir itself or copy
            } else {
                @copy($sourcePath, $destPath);
                $savedPreserved[] = $item;
                sendSSE('log', ['type' => 'info', 'text' => "🔒 Đã lưu trữ an toàn: {$item}"]);
            }
        }
    }

    // 4. Download Release Zip
    sendSSE('step', ['step' => 4, 'text' => "Đang tải mã nguồn bản phát hành [{$actualTag}]..."]);
    $tempZip = sys_get_temp_dir() . '/techwiz_release_' . time() . '.zip';
    $downloadOk = downloadGithubZip($zipballUrl, $token, $tempZip);
    
    if (!$downloadOk || !file_exists($tempZip) || filesize($tempZip) < 100) {
        sendSSE('log', ['type' => 'error', 'text' => "❌ Tải file nén Release thất bại từ GitHub. Vui lòng kiểm tra GitHub Token hoặc đường truyền!"]);
        sendSSE('finish', ['success' => false]);
        exit;
    }
    sendSSE('log', ['type' => 'success', 'text' => "✅ Đã tải về file nén (" . round(filesize($tempZip) / 1024 / 1024, 2) . " MB)"]);

    // 5. Extract & Unwrap Zip
    sendSSE('step', ['step' => 5, 'text' => 'Giải nén và cập nhật mã nguồn...']);
    $extractTemp = sys_get_temp_dir() . '/techwiz_extracted_' . time();
    @mkdir($extractTemp, 0777, true);

    $zip = new ZipArchive();
    $opened = $zip->open($tempZip);
    if ($opened === true) {
        $zip->extractTo($extractTemp);
        $zip->close();
    } else {
        // Fallback to system unzip
        @exec("unzip -q " . escapeshellarg($tempZip) . " -d " . escapeshellarg($extractTemp), $uOut, $uCode);
        if ($uCode !== 0) {
            sendSSE('log', ['type' => 'error', 'text' => "❌ Giải nén thất bại. ZipArchive và unzip đều không mở được file!"]);
            sendSSE('finish', ['success' => false]);
            exit;
        }
    }
    @unlink($tempZip);

    // GitHub zipball wraps all files inside a root folder: manhconne-techwiz-frontend-xxxx
    $files = scandir($extractTemp);
    $subDirs = array_values(array_filter($files, function($f) use ($extractTemp) {
        return !in_array($f, ['.', '..']) && is_dir($extractTemp . '/' . $f);
    }));

    $sourceRoot = $extractTemp;
    if (count($subDirs) === 1 && count(array_diff($files, ['.', '..'])) === 1) {
        $sourceRoot = $extractTemp . '/' . $subDirs[0];
        sendSSE('log', ['type' => 'info', 'text' => "📦 Tự động nhận diện và bóc tách thư mục gốc: {$subDirs[0]}"]);
    }

    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0755, true);
    }

    // Sync files using rsync or cp
    sendSSE('log', ['type' => 'info', 'text' => "🔄 Đang đồng bộ tệp tin vào thư mục: {$targetDir}..."]);
    $rsyncAvailable = trim(@shell_exec("which rsync 2>/dev/null") ?: '');
    if (!empty($rsyncAvailable)) {
        $syncCmd = "rsync -a --delete --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='updater' " . escapeshellarg($sourceRoot . '/') . " " . escapeshellarg($targetDir . '/') . " 2>&1";
    } else {
        $syncCmd = "cp -r -f " . escapeshellarg($sourceRoot) . "/. " . escapeshellarg($targetDir) . "/ 2>&1";
    }
    @exec($syncCmd, $sOutput, $sCode);

    // 6. Restore preserved files
    foreach ($savedPreserved as $item) {
        $src = $tempEnvDir . '/' . ltrim($item, '/');
        $dst = rtrim($targetDir, '/') . '/' . ltrim($item, '/');
        if (file_exists($src)) {
            @copy($src, $dst);
            sendSSE('log', ['type' => 'info', 'text' => "🔄 Khôi phục tệp bảo vệ: {$item}"]);
        }
    }
    // Record new version
    file_put_contents(rtrim($targetDir, '/') . '/.current_version', $actualTag);

    // Clean temp dirs
    @exec("rm -rf " . escapeshellarg($extractTemp) . " " . escapeshellarg($tempEnvDir));
    sendSSE('log', ['type' => 'success', 'text' => "✅ Cập nhật mã nguồn thành công!"]);

    // 7. Run Build Commands
    if ($skipBuild) {
        sendSSE('step', ['step' => 6, 'text' => 'Bỏ qua bước build (theo yêu cầu).']);
    } else {
        sendSSE('step', ['step' => 6, 'text' => 'Chạy lệnh build (npm install & build)...']);
        $cmd = "cd " . escapeshellarg($targetDir) . " && " . $config['build_command'] . " 2>&1";
        
        sendSSE('log', ['type' => 'info', 'text' => "⚙️ Thực thi: {$config['build_command']}"]);

        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w']
        ];
        $process = proc_open($cmd, $descriptors, $pipes, $targetDir);

        if (is_resource($process)) {
            fclose($pipes[0]);
            while (!feof($pipes[1])) {
                $line = fgets($pipes[1]);
                if ($line !== false && trim($line) !== '') {
                    sendSSE('log', ['type' => 'terminal', 'text' => rtrim($line)]);
                }
            }
            fclose($pipes[1]);
            fclose($pipes[2]);
            $exitCode = proc_close($process);

            if ($exitCode === 0) {
                sendSSE('log', ['type' => 'success', 'text' => "✅ Quá trình Build hoàn tất xuất sắc (Mã thoát: 0)!"]);
            } else {
                sendSSE('log', ['type' => 'warn', 'text' => "⚠️ Quá trình build kết thúc với mã {$exitCode}. Hãy kiểm tra log terminal bên trên nếu ứng dụng gặp lỗi."]);
            }
        } else {
            sendSSE('log', ['type' => 'error', 'text' => "❌ Không thể khởi tạo tiến trình proc_open để build!"]);
        }
    }

    // 8. Restart PM2 Process
    if (!empty($config['auto_restart_pm2']) && !empty($config['pm2_process_name'])) {
        sendSSE('step', ['step' => 7, 'text' => "Khởi động lại PM2 ({$config['pm2_process_name']})..."]);
        $pm2Name = escapeshellarg($config['pm2_process_name']);
        
        // Try reload first (zero-downtime) or restart
        $pm2Cmd = "pm2 reload {$pm2Name} 2>&1 || pm2 restart {$pm2Name} 2>&1";
        $pm2Out = @shell_exec($pm2Cmd);
        
        sendSSE('log', ['type' => 'info', 'text' => "🔄 Kết quả PM2: " . trim($pm2Out)]);
        sendSSE('log', ['type' => 'success', 'text' => "✅ Đã gửi lệnh làm mới tiến trình PM2 [{$config['pm2_process_name']}]!"]);
    }

    sendSSE('step', ['step' => 8, 'text' => 'Cập nhật thành công hoàn tất!']);
    sendSSE('log', ['type' => 'success', 'text' => "🎉 CHÚC MỪNG: Dự án đã được nâng cấp thành công lên phiên bản [{$actualTag}]!"]);
    sendSSE('finish', ['success' => true, 'new_version' => $actualTag]);
    exit;
}

// ---------------- FRONTEND HTML / DASHBOARD ----------------
$isLoggedIn = checkAuth($config);
?>
<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechWiz Release Updater - aaPanel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(18, 24, 38, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-hover: rgba(255, 255, 255, 0.12);
      --primary: #38bdf8;
      --primary-hover: #0ea5e9;
      --primary-glow: rgba(56, 189, 248, 0.25);
      --accent: #10b981;
      --accent-glow: rgba(16, 185, 129, 0.25);
      --danger: #ef4444;
      --warning: #f59e0b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --terminal-bg: #050811;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.08) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(99, 102, 241, 0.05) 0px, transparent 50%);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    code, pre, .mono {
      font-family: 'JetBrains Mono', monospace;
    }
    header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(9, 13, 22, 0.8);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--primary-glow);
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 16px 60px;
      width: 100%;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #fff;
    }
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      font-size: 0.85rem;
    }
    .info-label {
      color: var(--text-muted);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-info { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #fff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #38bdf8, #0ea5e9);
      transform: translateY(-1px);
    }
    .btn-accent {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      box-shadow: 0 4px 15px var(--accent-glow);
    }
    .btn-accent:hover {
      background: linear-gradient(135deg, #34d399, #10b981);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.775rem;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .release-item {
      border: 1px solid var(--card-border);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      transition: all 0.2s ease;
    }
    .release-item:hover {
      border-color: var(--card-hover);
      background: rgba(255, 255, 255, 0.04);
    }
    .release-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .release-tag {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
    }
    .release-body {
      font-size: 0.85rem;
      color: var(--text-muted);
      white-space: pre-wrap;
      max-height: 120px;
      overflow-y: auto;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      margin: 10px 0;
    }
    .terminal {
      background: var(--terminal-bg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      height: 380px;
      overflow-y: auto;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      color: #94a3b8;
    }
    .log-line {
      margin-bottom: 4px;
      word-break: break-all;
    }
    .log-info { color: #38bdf8; }
    .log-success { color: #34d399; font-weight: 600; }
    .log-warn { color: #fbbf24; }
    .log-error { color: #f87171; font-weight: 600; }
    .log-terminal { color: #cbd5e1; }
    
    .steps-container {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .step-pill {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .step-pill.active {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.4);
      animation: pulse 1.5s infinite;
    }
    .step-pill.completed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border-color: rgba(16, 185, 129, 0.4);
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .form-group {
      margin-bottom: 14px;
    }
    .form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 10px 12px;
      color: #fff;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 10px var(--primary-glow);
    }
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    .modal.active { display: flex; }
    .modal-content {
      background: #0f172a;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      width: 90%;
      max-width: 520px;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </div>
      <div>
        <div class="brand-title">TechWiz Deploy & Update Center</div>
        <div class="brand-subtitle">aaPanel Release Manager • manhconne/techwiz-frontend</div>
      </div>
    </div>

    <div style="display:flex; gap:10px;">
      <?php if ($isLoggedIn): ?>
        <button class="btn btn-secondary btn-sm" onclick="openSettingsModal()">
          ⚙️ Cấu hình
        </button>
        <a href="?action=logout" class="btn btn-secondary btn-sm" style="color:var(--danger)">
          Đăng xuất
        </a>
      <?php endif; ?>
    </div>
  </header>

  <div class="container">
    <?php if (!$isLoggedIn): ?>
      <!-- LOGIN CARD -->
      <div style="max-width: 420px; margin: 60px auto;">
        <div class="card" style="text-align: center; padding: 32px 24px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔐</div>
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">Xác thực Quản trị</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
            Nhập Secret Key cấu hình trong <code class="mono">config.json</code> để thao tác cập nhật.
          </p>
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group" style="text-align: left;">
              <label class="form-label">Secret Key / Mật mã</label>
              <input type="password" id="loginSecret" class="form-input" placeholder="Nhập Secret Key..." required autofocus>
            </div>
            <div id="loginError" style="color: var(--danger); font-size: 0.8rem; margin-bottom: 14px; display: none;"></div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Mở khóa hệ thống
            </button>
          </form>
        </div>
      </div>
    <?php else: ?>

      <!-- MAIN DASHBOARD -->
      <div class="grid-2">
        <!-- LEFT COLUMN: STATUS & QUICK ACTIONS -->
        <div>
          <div class="card">
            <div class="card-title">
              <span>🖥️</span> Trạng thái Môi trường
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Phiên bản hiện tại:</span>
                <span id="currentVer" class="badge badge-info mono">Đang tải...</span>
              </div>
              <div class="info-item">
                <span class="info-label">Node.js:</span>
                <span id="nodeVer" class="mono">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">NPM:</span>
                <span id="npmVer" class="mono">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">PM2 Status:</span>
                <span id="pm2Status" class="badge badge-warning">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">Thư mục Target:</span>
                <span id="targetStatus" class="badge badge-info">--</span>
              </div>
            </div>
            
            <div style="margin-top: 16px;">
              <button class="btn btn-secondary btn-sm" style="width:100%" onclick="loadStatus()">
                🔄 Kiểm tra lại trạng thái
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-title">
              <span>⚡</span> Tùy chọn Cập nhật
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" id="skipBuildCheck"> Bỏ qua lệnh build (<code class="mono">npm run build</code>)
              </label>
              <div style="font-size:0.75rem; color:var(--text-muted); line-height: 1.4;">
                * Các tệp <code class="mono">.env, .env.local</code> sẽ luôn được bảo tồn tự động.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: RELEASES & TERMINAL CONSOLE -->
        <div>
          <!-- TERMINAL & PROGRESS CARD -->
          <div class="card" id="terminalCard" style="display:none;">
            <div class="card-title" style="justify-content: space-between;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span>📟</span> Tiến trình Cập nhật Trực tiếp
              </div>
              <span id="statusBadge" class="badge badge-info">CHỜ</span>
            </div>

            <div class="steps-container">
              <span class="step-pill" id="step-1">1. GitHub Info</span>
              <span class="step-pill" id="step-2">2. Sao lưu</span>
              <span class="step-pill" id="step-3">3. Bảo lưu .env</span>
              <span class="step-pill" id="step-4">4. Tải Zip</span>
              <span class="step-pill" id="step-5">5. Giải nén</span>
              <span class="step-pill" id="step-6">6. Build code</span>
              <span class="step-pill" id="step-7">7. Restart PM2</span>
            </div>

            <div class="terminal" id="terminalLogs">
              <div class="log-line log-info">[Hệ thống sẵn sàng] Chọn phiên bản release bên dưới để bắt đầu...</div>
            </div>
          </div>

          <!-- RELEASES LIST CARD -->
          <div class="card">
            <div class="card-title" style="justify-content: space-between;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span>📦</span> Danh sách Phiên bản Releases
              </div>
              <button class="btn btn-secondary btn-sm" onclick="loadReleases()">
                Làm mới
              </button>
            </div>

            <div id="releasesList">
              <div style="text-align:center; padding: 30px; color:var(--text-muted);">
                Đang nạp danh sách releases từ GitHub...
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SETTINGS MODAL -->
      <div class="modal" id="settingsModal">
        <div class="modal-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1.1rem; font-weight:700;">⚙️ Cấu hình Hệ thống Updater</h3>
            <button class="btn btn-secondary btn-sm" onclick="closeSettingsModal()">✕</button>
          </div>
          <form onsubmit="handleSaveConfig(event)">
            <div class="form-group">
              <label class="form-label">GitHub Repository (owner/repo)</label>
              <input type="text" id="cfgRepo" class="form-input" value="<?= htmlspecialchars($config['github_repo'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">GitHub Personal Access Token (PAT)</label>
              <input type="password" id="cfgToken" class="form-input" placeholder="Để trống nếu repo Public hoặc giữ nguyên">
              <small style="color:var(--text-muted); font-size:0.75rem;">Cần thiết nếu repo là Private hoặc tránh giới hạn rate limit của GitHub.</small>
            </div>
            <div class="form-group">
              <label class="form-label">Thư mục Dự án Frontend trên Máy chủ aaPanel</label>
              <input type="text" id="cfgTarget" class="form-input" value="<?= htmlspecialchars($config['target_dir'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Lệnh Build</label>
              <input type="text" id="cfgBuild" class="form-input" value="<?= htmlspecialchars($config['build_command'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Tên tiến trình PM2</label>
              <input type="text" id="cfgPm2" class="form-input" value="<?= htmlspecialchars($config['pm2_process_name'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu Secret Key Quản trị</label>
              <input type="text" id="cfgSecret" class="form-input" value="<?= htmlspecialchars($config['secret_key'] ?? '') ?>" required>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
              <button type="button" class="btn btn-secondary" onclick="closeSettingsModal()">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu cấu hình</button>
            </div>
          </form>
        </div>
      </div>

    <?php endif; ?>
  </div>

  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const secret = document.getElementById('loginSecret').value;
      const errBox = document.getElementById('loginError');
      errBox.style.display = 'none';

      try {
        const res = await fetch('?action=login', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'password=' + encodeURIComponent(secret)
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          errBox.textContent = data.message || 'Mật mã không đúng!';
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.textContent = 'Lỗi kết nối máy chủ.';
        errBox.style.display = 'block';
      }
    }

    <?php if ($isLoggedIn): ?>
    let currentInstalledVer = '';

    async function loadStatus() {
      try {
        const res = await fetch('?action=status');
        const data = await res.json();
        if (data.success) {
          currentInstalledVer = data.current_version;
          document.getElementById('currentVer').textContent = data.current_version;
          document.getElementById('nodeVer').textContent = data.node_version;
          document.getElementById('npmVer').textContent = data.npm_version;
          
          const pm2Badge = document.getElementById('pm2Status');
          pm2Badge.textContent = data.pm2_status;
          pm2Badge.className = 'badge ' + (data.pm2_status === 'online' ? 'badge-success' : 'badge-warning');

          const targetBadge = document.getElementById('targetStatus');
          if (data.target_dir_exists && data.target_dir_writable) {
            targetBadge.textContent = 'Hợp lệ & Sẵn sàng';
            targetBadge.className = 'badge badge-success';
          } else if (data.target_dir_exists) {
            targetBadge.textContent = 'Thiếu quyền ghi (chown www)';
            targetBadge.className = 'badge badge-warning';
          } else {
            targetBadge.textContent = 'Chưa tồn tại (sẽ tự tạo)';
            targetBadge.className = 'badge badge-info';
          }
        }
      } catch(e) {
        console.error(e);
      }
    }

    async function loadReleases() {
      const container = document.getElementById('releasesList');
      container.innerHTML = '<div style="text-align:center; padding: 30px; color:var(--text-muted);">Đang nạp danh sách releases từ GitHub...</div>';
      try {
        const res = await fetch('?action=releases');
        const data = await res.json();
        if (!data.success) {
          container.innerHTML = `<div style="padding:20px; color:var(--danger)">❌ ${data.message}</div>`;
          return;
        }

        const releases = data.releases;
        if (!releases || releases.length === 0) {
          container.innerHTML = `<div style="padding:30px; text-align:center; color:var(--text-muted)">
            Chưa có Release nào trên Repository. Hãy tạo Release hoặc Tag phiên bản đầu tiên trên GitHub!
          </div>`;
          return;
        }

        container.innerHTML = releases.map((rel, index) => {
          const isCurrent = currentInstalledVer && currentInstalledVer.includes(rel.tag_name);
          const dateStr = new Date(rel.published_at).toLocaleString('vi-VN');
          return `
            <div class="release-item">
              <div class="release-header">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="release-tag mono">${rel.tag_name}</span>
                    ${index === 0 ? '<span class="badge badge-success">MỚI NHẤT</span>' : ''}
                    ${isCurrent ? '<span class="badge badge-info">ĐANG DÙNG</span>' : ''}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                    ${rel.name || rel.tag_name} • Đăng lúc: ${dateStr}
                  </div>
                </div>
                <div>
                  <button class="btn btn-primary btn-sm" onclick="triggerUpdate('${rel.tag_name}')">
                    🚀 Cập nhật bản này
                  </button>
                </div>
              </div>
              ${rel.body ? `<div class="release-body">${escapeHtml(rel.body)}</div>` : ''}
            </div>
          `;
        }).join('');
      } catch(err) {
        container.innerHTML = `<div style="padding:20px; color:var(--danger)">Lỗi nạp releases: ${err.message}</div>`;
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function triggerUpdate(tag) {
      if (!confirm(`Bạn có chắc chắn muốn cập nhật toàn bộ code lên phiên bản [${tag}]?`)) {
        return;
      }

      document.getElementById('terminalCard').style.display = 'block';
      const terminalLogs = document.getElementById('terminalLogs');
      terminalLogs.innerHTML = `<div class="log-line log-info">🚀 Đang kết nối tiến trình cập nhật [${tag}]...</div>`;
      
      const statusBadge = document.getElementById('statusBadge');
      statusBadge.textContent = 'ĐANG CHẠY';
      statusBadge.className = 'badge badge-warning';

      // Reset step pills
      for (let i = 1; i <= 7; i++) {
        const p = document.getElementById('step-' + i);
        if (p) p.className = 'step-pill';
      }

      const skipBuild = document.getElementById('skipBuildCheck').checked ? '1' : '0';
      const evtSource = new EventSource(`?action=perform_update&tag=${encodeURIComponent(tag)}&skip_build=${skipBuild}`);

      evtSource.addEventListener('step', function(e) {
        const data = JSON.parse(e.data);
        for (let i = 1; i < data.step; i++) {
          const prev = document.getElementById('step-' + i);
          if (prev) prev.className = 'step-pill completed';
        }
        const current = document.getElementById('step-' + data.step);
        if (current) current.className = 'step-pill active';
      });

      evtSource.addEventListener('log', function(e) {
        const data = JSON.parse(e.data);
        const line = document.createElement('div');
        line.className = 'log-line log-' + data.type;
        line.textContent = data.text;
        terminalLogs.appendChild(line);
        terminalLogs.scrollTop = terminalLogs.scrollHeight;
      });

      evtSource.addEventListener('finish', function(e) {
        const data = JSON.parse(e.data);
        evtSource.close();
        if (data.success) {
          statusBadge.textContent = 'HOÀN TẤT';
          statusBadge.className = 'badge badge-success';
          loadStatus();
          loadReleases();
        } else {
          statusBadge.textContent = 'THẤT BẠI';
          statusBadge.className = 'badge badge-danger';
        }
      });

      evtSource.onerror = function(err) {
        evtSource.close();
        const line = document.createElement('div');
        line.className = 'log-line log-error';
        line.textContent = '❌ Mất kết nối SSE tới máy chủ cập nhật.';
        terminalLogs.appendChild(line);
        statusBadge.textContent = 'MẤT KẾT NỐI';
        statusBadge.className = 'badge badge-danger';
      };
    }

    function openSettingsModal() {
      document.getElementById('settingsModal').classList.add('active');
    }
    function closeSettingsModal() {
      document.getElementById('settingsModal').classList.remove('active');
    }

    async function handleSaveConfig(e) {
      e.preventDefault();
      const payload = {
        github_repo: document.getElementById('cfgRepo').value,
        target_dir: document.getElementById('cfgTarget').value,
        build_command: document.getElementById('cfgBuild').value,
        pm2_process_name: document.getElementById('cfgPm2').value,
        secret_key: document.getElementById('cfgSecret').value
      };
      const token = document.getElementById('cfgToken').value;
      if (token) {
        payload.github_token = token;
      }

      try {
        const res = await fetch('?action=save_config', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Đã lưu cấu hình thành công!');
          closeSettingsModal();
          loadStatus();
          loadReleases();
        } else {
          alert('Lỗi: ' + data.message);
        }
      } catch(err) {
        alert('Lỗi lưu cấu hình: ' + err.message);
      }
    }

    // Auto initialize
    loadStatus().then(loadReleases);
    <?php endif; ?>
  </script>
</body>
</html>
