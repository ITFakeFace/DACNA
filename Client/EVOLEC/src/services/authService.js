// src/utils/authService.js

import { jwtDecode } from "jwt-decode";


// Hàm giải mã JWT và lấy thông tin từ token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Hàm kiểm tra token còn hạn sử dụng
export const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const currentTime = Date.now() / 1000; // Đổi sang giây
  return decoded.exp > currentTime;
};

// Hàm lấy vai trò (role) từ token
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }
  return null;
};

// Hàm lấy tên người dùng (username) từ token
export const getUsernameFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  }
  return null;
};

export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  }
  return null;
};

export const getEmailFromToken = (token) => {
  const decoded = decodeToken(token);
  if (decoded) {
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
  }
  return null;
};
