import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// TODO: Thay thế bằng Firebase Config của bạn (lấy từ Firebase Console -> Project Settings -> General)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy...",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "notificationservice-aacfd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "notificationservice-aacfd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcde",
};

// Khởi tạo Firebase an toàn (tránh khởi tạo nhiều lần)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export hàm tiện ích để lấy Messaging (chỉ hỗ trợ trên trình duyệt, không dùng ở SSR)
export const messaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export { app, getToken, onMessage };
