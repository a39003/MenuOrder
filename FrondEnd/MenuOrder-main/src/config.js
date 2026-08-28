export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Thông tin thanh toán được lấy từ backend. Không đặt số tài khoản trong bundle FE.
export const PAYMENT_CONFIG_URL = `${API_URL}/settings/payment`;
