import CryptoJS from "crypto-js";

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data);
};
