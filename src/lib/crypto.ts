import CryptoJS from "crypto-js";

export const encrypt = (data: string, key: string) => {
  const keyHex = CryptoJS.enc.Base64.parse(key);
  const messageHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const decrypt = (data: string, key: string) => {
  try {
    const keyHex = CryptoJS.enc.Base64.parse(key);

    const decrypt = CryptoJS.AES.decrypt(data, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt);
  } catch {
    return "";
  }
};
