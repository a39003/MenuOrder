import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../config/Logo TL.png";
import * as message from "../../costormer/Components/message/Message";
import { LoginCar, LoginContainer, LoginPage, LoginVisual } from "./style";

const Login = () => {
  const [values, setValues] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  useEffect(() => { if (localStorage.getItem("token")) navigate("/admin/order"); }, [navigate]);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    if (!values.username || !values.password) return message.warning("Vui lòng nhập tài khoản và mật khẩu");
    try {
      const res = await fetch("http://localhost:8080/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json();
      if (res.ok) { localStorage.setItem("token", data.jwt); message.success("Đăng nhập thành công"); navigate("/admin/order"); }
      else message.error("Tài khoản hoặc mật khẩu không đúng");
    } catch { message.warning("Không thể kết nối máy chủ. Vui lòng thử lại."); }
  };

  return <LoginPage>
    <LoginVisual><span>TLU RESTAURANT</span><h1>Quản lý nhà hàng, nhẹ nhàng hơn.</h1><p>Theo dõi bàn, món ăn và đơn hàng trong một không gian làm việc trực quan.</p></LoginVisual>
    <LoginContainer><LoginCar>
      <img className="logo" src={logo} alt="TLU Quán"/><h2>Chào mừng trở lại</h2><p className="subtitle">Đăng nhập để bắt đầu ca làm việc.</p>
      <form onSubmit={handleSubmitLogin}>
        <Input prefix={<UserOutlined/>} placeholder="Tài khoản" value={values.username} onChange={(e)=>setValues({...values,username:e.target.value})}/>
        <Input.Password prefix={<LockOutlined/>} placeholder="Mật khẩu" value={values.password} onChange={(e)=>setValues({...values,password:e.target.value})}/>
        <button className="login-button" type="submit">Đăng nhập</button>
      </form>
    </LoginCar></LoginContainer>
  </LoginPage>;
};
export default Login;
