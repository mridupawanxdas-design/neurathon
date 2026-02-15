// src/api.ts
import axios from "axios";
import { API_BASE } from "./config";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
