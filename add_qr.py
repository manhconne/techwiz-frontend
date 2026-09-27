import os

filepath = 'components/LocationAwareEventExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_str = "{/* Barcode Simulation */}"
end_str = "                {/* Actions */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx)

mock_tx_hash = "0x" + "".join([str(hex(x))[2:] for x in os.urandom(32)])
mock_token_id = str(abs(hash(os.urandom(8))) % 10000)

new_qr = f"""{{/* Blockchain QR Code Simulation */}}
                    <div className="mt-4 pt-4 border-t border-slate-200 border-dashed flex flex-col items-center">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                        <QRCode 
                          value={{`https://sepolia.etherscan.io/tx/{mock_tx_hash}`}} 
                          size={{100}} 
                          style={{{{ height: "auto", maxWidth: "100px", width: "100%" }}}}
                          viewBox={{`0 0 100 100`}}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-left bg-slate-900 rounded-lg p-3">
                        <div className="text-[10px] text-slate-400 font-mono uppercase mb-1 flex items-center justify-between">
                            <span>Blockchain Ticket</span>
                            <span className="text-emerald-400 font-bold">MINTED</span>
                        </div>
                        <div className="text-[11px] text-white font-mono break-all leading-tight">
                            TxHash: <span className="text-blue-300">{mock_tx_hash}</span>
                        </div>
                        <div className="text-[11px] text-white font-mono mt-1">
                            TokenID: <span className="text-pink-400">#{mock_token_id}</span>
                        </div>
                    </div>
                  </div>

"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_qr + content[end_idx:]
    print("Replaced!")
else:
    print(f"Indices: {start_idx}, {end_idx}")

if "import QRCode from" not in content:
    content = content.replace("import React,", "import QRCode from 'react-qr-code';\nimport React,")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)