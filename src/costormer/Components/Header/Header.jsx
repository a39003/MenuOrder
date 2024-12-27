import React from "react"
import {WrapperHeader, WrapperMenu, WrapperContentPopup, WrapperOrder} from "./style"
import { Col, Popover } from "antd";
import {UnorderedListOutlined, ProfileOutlined, UserOutlined, ApartmentOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from "react-router-dom";







const Header = ({ismenu = false, isorder = false}) => {
    const navigate = useNavigate()

    const content = (
        <div>
            <WrapperContentPopup onClick={() => navigate('/admin/table')}><ApartmentOutlined /> Quản lý bàn </WrapperContentPopup>
            <WrapperContentPopup onClick={() => navigate('/admin/menu')}><ProfileOutlined /> Quản lý Menu </WrapperContentPopup>
            <WrapperContentPopup onClick={() => navigate('/account')}><UserOutlined /> Tài khoản </WrapperContentPopup>
        </div>
    );

    return(
        <div>
            <WrapperHeader>
                {!ismenu &&(                
                    <Col span={1}>
                        <WrapperMenu>
                            <Popover content={content} trigger="click">
                                <UnorderedListOutlined style={{fontSize:'20px'}}/>
                            </Popover>
                        </WrapperMenu>
                    </Col>)}
                {!isorder &&(
                    <Col>
                        <WrapperOrder>
                        <FileDoneOutlined />
                            <div style={{cursor:'pointer'}} onClick={() => navigate('/admin/order')}>Quản lý đơn đặt hàng</div>
                        </WrapperOrder>
                    </Col>
                )}

            </WrapperHeader>
        </div>
    )
}

export default Header