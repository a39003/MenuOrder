import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../config/Logo TL.png";
import * as message from "../../costormer/Components/message/Message";
import { LoginCar, LoginContainer, LoginPage, LoginVisual } from "./style";
import { API_URL } from "../../config";
import { clearSession, getAccessToken, getCurrentUser, refreshSession, saveSession } from "../../services/auth";

const Login = () => {
  const [values, setValues] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      const token = getAccessToken();
      if (!token) return;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 <= Date.now()) await refreshSession();
        if (active) navigate(getCurrentUser()?.role === "BEP" ? "/admin/kitchen" : "/admin/order");
      } catch {
        clearSession();
      }
    };
    restoreSession();
    return () => { active = false; };
  }, [navigate]);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!values.username || !values.password)
      return message.warning("Vui lòng nhập tài khoản và mật khẩu");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const responseText = await res.text();
      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
        }
      }

      if (res.ok) {
        if (!data?.jwt)
          throw new Error("Máy chủ không trả về token đăng nhập.");
        saveSession(data);
        message.success("Đăng nhập thành công");
        navigate(data?.user?.role === "BEP" ? "/admin/kitchen" : "/admin/order");
      } else {
        message.error(data?.message || "Tài khoản hoặc mật khẩu không đúng");
      }
    } catch (error) {
      message.warning(
        error.message || "Không thể kết nối máy chủ. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginPage>
      <LoginVisual>
        <span>TLU RESTAURANT</span>
        <h1>Quản lý nhà hàng, nhẹ nhàng hơn.</h1>
        <p>
          Theo dõi bàn, món ăn và đơn hàng trong một không gian làm việc trực
          quan.
        </p>
      </LoginVisual>
      <LoginContainer>
        <LoginCar>
          <img className="logo" src={logo} alt="TLU Quán" />
          <h2>Chào mừng trở lại</h2>
          <p className="subtitle">Đăng nhập để bắt đầu ca làm việc.</p>
          <form onSubmit={handleSubmitLogin}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Tài khoản"
              value={values.username}
              disabled={submitting}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              value={values.password}
              disabled={submitting}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
            <button
              className="login-button"
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Đang kết nối máy chủ..." : "Đăng nhập"}
            </button>
          </form>
        </LoginCar>
      </LoginContainer>
    </LoginPage>
  );
};
export default Login;
