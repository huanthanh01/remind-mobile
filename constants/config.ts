/**
 * App configuration constants.
 * The BASE_URL points to the deployed remind-backend.
 * Change this when testing locally (e.g. http://10.0.2.2:3000 for Android emulator).
 */

// Sử dụng localhost cho Web/iOS Simulator, hoặc 10.0.2.2 cho Android Emulator
// export const BASE_URL = 'https://remind-backend-wdv3.onrender.com'; // Production
export const BASE_URL = 'http://10.0.2.2:3000'; // Đổi thành http://localhost:3000 nếu test trên Web/iOS
export const API_BASE_URL = `${BASE_URL}/api`;
