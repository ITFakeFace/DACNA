// src/utils/APIService.js

import axios from "axios";

// Khởi tạo axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5208/api", // Địa chỉ API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("token")

// Hàm xử lý GET request
export const getRequest = async (url) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in GET request", error);
    throw error;
  }
};

// Hàm xử lý POST request
export const postRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in POST request", error);
    throw error;
  }
};

// Hàm xử lý PUT request
export const putRequest = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in PUT request", error);
    throw error;
  }
};

// Hàm xử lý DELETE request
export const deleteRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in DELETE request", error);
    throw error;
  }
};
