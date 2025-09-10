

// src/utils/aes.ts
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_ENCRYPT_KEY; // Must be the same on Flutter side
const iv = CryptoJS.enc.Utf8.parse("6543210987654321"); // 16 chars IV

export function encrypt(text: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function decrypt(cipher: string): string {
  const decrypted = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}




 
