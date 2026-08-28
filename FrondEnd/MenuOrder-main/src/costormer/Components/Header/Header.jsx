import React, { useEffect, useState } from "react";
import { Modal, Popover } from "antd";
import {
  ApartmentOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
  UserOutlined,
  GatewayOutlined,
  LogoutOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Brand,
  DesktopNav,
  WrapperContentPopup,
  WrapperHeader,
  WrapperMenu,
} from "./style";
import { getCurrentUser } from "../../../services/auth";
import { logout } from "../../../services/auth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = getCurrentUser()?.role;
  const allowed = (...roles) => roles.includes(role);
  const confirmLogout = () => {
    setMenuOpen(false);
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc muốn đăng xuất khỏi hệ thống?",
      okText: "Đồng ý",
      cancelText: "Ở lại",
      centered: true,
      onOk: async () => {
        await logout();
        navigate("/login", { replace: true });
      },
    });
  };
  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const content = (
    <div>
      {allowed("ADMIN") && <WrapperContentPopup onClick={() => goTo("/admin/dashboard")}>
        <BarChartOutlined /> Tổng quan
      </WrapperContentPopup>}
      <WrapperContentPopup onClick={() => goTo("/admin/order")}>
        <FileDoneOutlined /> Đơn hàng
      </WrapperContentPopup>
      {allowed("ADMIN", "BEP") && <WrapperContentPopup onClick={() => goTo("/admin/kitchen")}>
        <CoffeeOutlined /> Khu vực bếp
      </WrapperContentPopup>}
      {allowed("ADMIN", "BEP") && <WrapperContentPopup onClick={() => goTo("/admin/dish")}>
        <ProfileOutlined /> Trạng thái món ăn
      </WrapperContentPopup>}
      {allowed("ADMIN", "THU_NGAN") && <WrapperContentPopup onClick={() => goTo("/admin/bills")}>
        <FileTextOutlined /> Lịch sử hóa đơn
      </WrapperContentPopup>}
      {allowed("ADMIN", "NHAN_VIEN", "THU_NGAN") && <WrapperContentPopup onClick={() => goTo("/admin/table")}>
        <ApartmentOutlined /> Quản lý bàn
      </WrapperContentPopup>}
      {allowed("ADMIN", "NHAN_VIEN", "THU_NGAN") && <WrapperContentPopup onClick={() => goTo("/admin/floor-plan")}>
        <GatewayOutlined /> Sơ đồ bàn
      </WrapperContentPopup>}
      {allowed("ADMIN") && <WrapperContentPopup onClick={() => goTo("/admin/menu")}>
        <ProfileOutlined /> Quản lý Menu
      </WrapperContentPopup>}
      {allowed("ADMIN") && <WrapperContentPopup onClick={() => goTo("/account")}>
        <UserOutlined /> Tài khoản
      </WrapperContentPopup>}
      <WrapperContentPopup onClick={confirmLogout}>
        <LogoutOutlined /> Đăng xuất
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
        {allowed("BEP") && <button
          className={location.pathname === "/admin/kitchen" ? "active" : ""}
          onClick={() => navigate("/admin/kitchen")}
        >
          <CoffeeOutlined />
          <span>Khu vực bếp</span>
        </button>}
        <button
          className={location.pathname === "/admin/order" ? "active" : ""}
          onClick={() => navigate("/admin/order")}
        >
          <FileDoneOutlined />
          <span>Đơn hàng</span>
        </button>
        {allowed("ADMIN", "NHAN_VIEN", "THU_NGAN") && <button
          className={location.pathname === "/admin/floor-plan" ? "active" : ""}
          onClick={() => navigate("/admin/floor-plan")}
        >
          <GatewayOutlined />
          <span>Sơ đồ bàn</span>
        </button>}
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
