// src/lib/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://api.vayukrishi.in/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("vk_token="))
      ?.split("=")[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/hi/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);
