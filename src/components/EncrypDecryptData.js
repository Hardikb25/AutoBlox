import * as React from "react";
import CryptoJS from 'crypto-js';
import CONSTANT from "./Global";

export const encryptData = (data) => {
   
  //console.log(btoa(data))
  return(CryptoJS.AES.encrypt(data.toString(), CONSTANT.ENCRYPTIONKEY).toString());   
}
export const decryptData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data.toString(), CONSTANT.ENCRYPTIONKEY);
   return bytes.toString(CryptoJS.enc.Utf8);
  
}
