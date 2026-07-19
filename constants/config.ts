/**
 * App configuration constants.
 * The BASE_URL points to the deployed remind-backend.
 * Change this when testing locally (e.g. http://10.0.2.2:3000 for Android emulator).
 */

// Sử dụng địa chỉ IP LAN (192.168.1.13) để test Expo Go trên điện thoại thật
// export const BASE_URL = 'https://remind-backend-wdv3.onrender.com'; // Production
export const BASE_URL = 'http://192.168.1.13:3000'; // Đổi IP này nếu máy tính đổi mạng WiFi
export const API_BASE_URL = `${BASE_URL}/api`;
