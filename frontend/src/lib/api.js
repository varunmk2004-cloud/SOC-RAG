
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001",
  timeout: 120000,
});

export async function analyzeSecurityEvent(event: {
  username: string;
  source_ip: string;
  failed_logins: number;
  successful_login: boolean;
  unique_ips: number;
  unusual_hour: number;
  admin_action: number;
}) {
  const response = await api.post("/analyze", event);
  return response.data;
}

export default api;
