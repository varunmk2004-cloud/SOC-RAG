
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function analyzeSecurityEvent(event) {
  const response = await api.post("/analyze", event);
  return response.data;
}
