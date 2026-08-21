import React, { useState } from "react";
import { Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import Modald from "../../costormer/Components/Modal/Modal";
import { MainContent, ProfileContainer } from "./style";

const Account = () => {
  const [open,setOpen]=useState(false);
  const logout=()=>{localStorage.removeItem("token");window.location.href="/login";};
  return <MainContent><ProfileContainer>
    <Avatar size={76} icon={<UserOutlined/>}/><h2>Quản trị viên</h2><p className="role">Quản lý hệ thống TLU Quán</p>
    <div className="profile-row"><span>Họ và tên</span><strong>Phạm Minh Hiếu</strong></div>
    <div className="profile-row"><span>Email</span><strong>admin@gmail.com</strong></div>
    <button className="logout" onClick={()=>setOpen(true)}><LogoutOutlined/> &nbsp;Đăng xuất</button>
    <Modald title="Đăng xuất" open={open} onCancel={()=>setOpen(false)} onOk={logout} okText="Đăng xuất" cancelText="Ở lại">Bạn có chắc muốn đăng xuất khỏi hệ thống?</Modald>
  </ProfileContainer></MainContent>;
};
export default Account;
