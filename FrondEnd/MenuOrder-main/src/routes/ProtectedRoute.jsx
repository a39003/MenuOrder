import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAccessToken, getCurrentUser, hasAnyRole } from "../services/auth";

const ProtectedRoute = ({ roles = [], children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleExpired = (event) => {
      message.warning(event.detail || "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      navigate("/login", { replace: true, state: { from: location.pathname } });
    };
    window.addEventListener("session-expired", handleExpired);
    return () => window.removeEventListener("session-expired", handleExpired);
  }, [location.pathname, navigate]);

  if (!getAccessToken()) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!hasAnyRole(roles)) {
    const home = getCurrentUser()?.role === "BEP" ? "/admin/kitchen" : "/admin/order";
    return <Navigate to={home} replace />;
  }
  return children;
};

export default ProtectedRoute;
