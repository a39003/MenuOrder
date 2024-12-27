import { Info, LogoutButton, MainContent, ProfileContainer } from "./style"
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Form, Input, Space } from 'antd';
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ButtonComponent from "../../costormer/Components/Button/Button";
import Modald from "../../costormer/Components/Modal/Modal";
import Foor from "../../costormer/Components/Foor/Foor";



const Account = () => {

    const [isModalOpenLogout, setIsModalOpenLogout] = useState(false)
    const navigate = useNavigate()


    const showModal = () => {
        setIsModalOpenLogout(true);
      };


      const handleCancel = () => {
        setIsModalOpenLogout(false)
    }

    const handleOk = () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    };


    return(
        <div  style={{backgroundColor: "#f3e2d3", height: "200vh"}}>
            <MainContent>
                <ProfileContainer >
                     <Avatar size={64} icon={<UserOutlined />} />
                    <h3>Admin</h3>
                    <Form
                    name="account"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                  >
                    <Form.Item
                      label="Họ và tên"
                      name="username"
                    >
                      <Input placeholder='Phạm Minh Hiếu' readOnly />
                    </Form.Item>
                
                    <Form.Item
                      label="Email"
                      name="password"
                    >
                      <Input type="email" placeholder="admin@gmail.com" readOnly  />
                    </Form.Item>
                    </Form>
                    <ButtonComponent
                    onClick={showModal}
                    size={40}
                    styleButton={{
                        background: '#FFFFFF',
                        height: '38px',
                        with: '100%',
                        border: '1px solid #D5C3A7',
                        borderRadius: '5px',
                        margin: '26px 0 10px',
                    }}
                    textButton={'Đăng xuất'}
                    styleText={{ color: '#000', fontSize: '15px', fontWeight: '600'}}>
                    </ButtonComponent>
                    <Modald title="Đăng Xuất" open={isModalOpenLogout}  onCancel={handleCancel}  onOk={handleOk} okText="Có" cancelText="Hủy">
                        <div>Bạn có muốn đăng xuất không</div>
                    </Modald>
                </ProfileContainer>
            </MainContent>    
         <Foor/>
        </div>
    )
}

export default Account