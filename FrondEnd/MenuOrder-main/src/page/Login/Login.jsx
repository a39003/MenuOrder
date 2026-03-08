import React, { useEffect }  from "react"
import Header from "../../costormer/Components/Header/Header"
import { LoginContainer, LoginCar} from "./style"
import logo from "../../config/Logo TL.png";
import { Alert, Image } from "antd";
import Inputd from "../../costormer/Components/Input/Input"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import ButtonComponent from "../../costormer/Components/Button/Button";
import Foor from "../../costormer/Components/Foor/Foor";
import * as message from '../../costormer/Components/message/Message'
import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";



const Login = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [values, setValues] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      if (localStorage.getItem("token")) {
        navigate("/admin/order");
      }
    }, [navigate]);
  
    const handleSubmitLogin = async (e) => {
      e.preventDefault();
    
      // Kiểm tra nếu tài khoản hoặc mật khẩu trống
      if (!values.username || !values.password) {
        message.warning("Mời bạn nhập tài khoản và mật khẩu");
        return;
      }
    
      try {
        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
        });
    
        const data = await res.json();
        if (res.status === 200) {
          localStorage.setItem("token", data.jwt);
          navigate("/admin/order");
          message.success("Đăng nhập thành công");
        } else {
          message.error("Tài khoản hoặc mật khẩu không đúng, vui lòng thử lại");
        }
      } catch (error) {
        console.error("Error during login:", error);
        message.warning("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    };
    
    return( 
        <div style={{    backgroundColor: '#f3e2d3', height: "200vh"}}> 
            <Header ismenu isorder/>
            <LoginContainer>
                <LoginCar>
                    <h2 style={{margin:'20px 0', color:'#000'}}>TLU Quán</h2>
                    <Image src={logo} preview={false} alt="logo" style={{width:'80px', margin:'20px', borderRadius:'20%'}}/>
                        
                    <InpuComponent style={{marginBottom: '10px'}} placeholder="Tài khoản" 
                    value={values.username} onChange={(e) => setValues({ ...values, username: e.target.value })}
                    />

                    <div style={{position: 'relative'}}>
                        <span
                            onClick={ () => setIsShowPassword(!isShowPassword)} 
                            style={{
                            zIndex: 10, 
                            position: 'absolute',
                            top: '4px',
                            right: '8px'
                        }}>{
                        isShowPassword ? (
                            <EyeFilled/>
                        ) : (
                            <EyeInvisibleFilled />
                        )}
                        </span>
                        <InpuComponent placeholder="Mật khẩu" type={ isShowPassword ? "text" : "password"}
                            value={values.password} onChange={(e) =>setValues({ ...values, password: e.target.value })}
                            />
                    </div>
                    <ButtonComponent
                    // disabled={!values.username.length || !values.password.length} 
                    onClick={handleSubmitLogin}
                    size={40}
                    styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '30px',
                        with: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 10px',
                    }}
                    textButton={'Đăng nhập'}
                    styleText={{ color: '#fff', fontSize: '15px', fontWeight: '700'}}>
                    </ButtonComponent>
                </LoginCar>
            </LoginContainer>
            <Foor/>
        </div>
    )
}

export default Login