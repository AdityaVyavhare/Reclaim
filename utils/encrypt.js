import CryptoJS from "crypto-js";

// 32-byte key
const SECRET_KEY = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");

// Helper: Convert Base64 → Base64URL
const base64ToBase64Url = (base64) => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Helper: Convert Base64URL → Base64
const base64UrlToBase64 = (base64url) => {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  // Add padding if needed
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64;
};

// Encrypt Function
export const encryptStrings = (str1, str2) => {
  const mergedString = `${str1}$$${str2}`;
  const encrypted = CryptoJS.AES.encrypt(mergedString, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
  }).toString();

  // Convert to URL-safe
  const urlSafe = base64ToBase64Url(encrypted);
  return urlSafe;
};

// Decrypt Function
export const decryptStrings = (encryptedUrlSafeString) => {
  const base64 = base64UrlToBase64(encryptedUrlSafeString);

  const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY, {
    mode: CryptoJS.mode.ECB,
  }).toString(CryptoJS.enc.Utf8);

  return decrypted.split("$$");
};
