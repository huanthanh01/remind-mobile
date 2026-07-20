/**
 * App configuration constants.
 * The BASE_URL points to the deployed remind-backend.
 * Change this when testing locally (e.g. http://10.0.2.2:3000 for Android emulator).
 */

// Physical device (scan QR with Expo Go): use your computer's LAN IP (this machine is 192.168.1.60).
export const BASE_URL = 'http://10.12.96.222:4000'; // Physical phone on same WiFi
// export const BASE_URL = 'http://localhost:4000'; // iOS Simulator
// export const BASE_URL = 'http://10.0.2.2:4000'; // Android Emulator
// export const BASE_URL = 'https://remind-backend-wdv3.onrender.com'; // Production
export const API_BASE_URL = `${BASE_URL}/api`;
