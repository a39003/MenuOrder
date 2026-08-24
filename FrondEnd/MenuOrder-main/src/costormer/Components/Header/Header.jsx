import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import {
  ApartmentOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
  UserOutlined,
  GatewayOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brand,
  DesktopNav,
  WrapperContentPopup,
  WrapperHeader,
  WrapperMenu,
} from "./style";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => goTo("/admin/dashboard")}>
        <BarChartOutlined /> Tổng quan
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/admin/order")}>
        <FileDoneOutlined /> Đơn hàng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/admin/bills")}>
        <FileTextOutlined /> Lịch sử hóa đơn
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/admin/table")}>
        <ApartmentOutlined /> Quản lý bàn
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/admin/floor-plan")}>
        <GatewayOutlined /> Sơ đồ bàn
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/admin/menu")}>
        <ProfileOutlined /> Quản lý Menu
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => goTo("/account")}>
        <UserOutlined /> Tài khoản
      </WrapperContentPopup>
    </div>
  );
  return (
    <WrapperHeader>
      <Brand onClick={() => navigate("/admin/order")}>
        <div>TL</div>
        <section>
          <strong>TLU Quán</strong>
          <span>Admin workspace</span>
        </section>
      </Brand>
      <DesktopNav>
        <button
          className={location.pathname === "/admin/order" ? "active" : ""}
          onClick={() => navigate("/admin/order")}
        >
          <FileDoneOutlined />
          <span>Đơn hàng</span>
        </button>
      </DesktopNav>
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        open={menuOpen}
        onOpenChange={setMenuOpen}
      >
        <WrapperMenu aria-label="Mở menu">
          <UnorderedListOutlined />
        </WrapperMenu>
      </Popover>
    </WrapperHeader>
  );
};
export default Header;
