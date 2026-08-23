import React, { useEffect, useState } from "react";
import { Input, message } from "antd";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import hero from "../../../config/ngon.jpeg";
import promo from "../../../config/dep.jpg";
import {
  Cartd,
  ContentMain1,
  Contents,
  Footer,
  GuestForm,
  Headers,
  Page,
  Promo,
  Titles,
} from "./style";
import { API_URL } from "../../../config";

const ClientTable = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const vietnamTime = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(currentTime);
  const handleCreateOrder = async () => {
    if (submitting) return;
    if (!customerName.trim()) {
      message.warning("Vui lòng nhập tên của bạn trước khi xem thực đơn");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/tables/${tableId}/menus?customerName=${encodeURIComponent(customerName.trim())}`,
      );
      const responseText = await res.text();
      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
        }
      }

      if (!res.ok) {
        throw new Error(
          data?.message || `Máy chủ phản hồi lỗi (${res.status}).`,
        );
      }

      if (!data) {
        throw new Error("Máy chủ không trả về dữ liệu thực đơn.");
      }

      if (data?.length > 0) {
        sessionStorage.setItem(`customer-${tableId}`, customerName.trim());
        message.success(`Chào ${customerName.trim()}, bàn đã sẵn sàng`);
        navigate(`/menu/${tableId}`);
      } else {
        throw new Error("Hiện chưa có thực đơn để hiển thị.");
      }
    } catch (error) {
      message.error(
        error.message || "Không thể tải thực đơn. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Page>
      <Headers>
        <Titles>TLU Quán · Bàn {tableId}</Titles>
      </Headers>
      <Contents>
        <ContentMain1>
          <img src={hero} alt="Không gian ẩm thực" />
          <div className="hero-copy">
            <span>Chào mừng bạn</span>
            <h1>Ăn ngon, vui trọn khoảnh khắc.</h1>
            <p>Giờ Việt Nam · {vietnamTime}</p>
          </div>
        </ContentMain1>
        <Promo>
          <div>
            <span className="eyebrow">ƯU ĐÃI HÔM NAY</span>
            <div className="discount">Giảm ngay 20%</div>
            <div className="description">
              Dành cho khách đặt bàn online. Hãy hỏi nhân viên để biết thêm chi
              tiết.
            </div>
          </div>
          <img src={promo} alt="Ưu đãi tại TLU Quán" />
        </Promo>
        <GuestForm>
          <div>
            <span>Thông tin khách hàng</span>
            <strong>Bạn tên gì?</strong>
            <small>
              Tên của bạn sẽ xuất hiện trên hóa đơn và giúp nhân viên phục vụ
              chính xác hơn.
            </small>
          </div>
          <Input
            size="large"
            maxLength={100}
            prefix={<UserOutlined />}
            placeholder="Nhập tên của bạn"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            onPressEnter={handleCreateOrder}
            disabled={submitting}
          />
        </GuestForm>
        <Cartd
          onClick={handleCreateOrder}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? "Đang chuẩn bị thực đơn..." : "Khám phá thực đơn"}
          &nbsp;
          <ArrowRightOutlined />
        </Cartd>
        <Footer>
          Địa chỉ: Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội
          <br />
          Hotline: 0123 456 789
        </Footer>
      </Contents>
    </Page>
  );
};
export default ClientTable;
