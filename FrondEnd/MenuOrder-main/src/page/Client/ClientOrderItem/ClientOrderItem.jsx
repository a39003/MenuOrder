import React, { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import {
  ArrowLeftOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { convertToTime } from "../../../costormer/Time/time";
import {
  ActionButton,
  BackButton,
  ContainerModal,
  EmptyState,
  FooterButton,
  Headers,
  OrderCard,
  OrderHero,
  OrderList,
  Page,
  StatusButton,
  StyledTable,
  SupportButton,
  Titles,
} from "./style";
import { API_URL } from "../../../config";

const statusTone = (status) => {
  if (status === "Đã ra món" || status === "Hoàn thành")
    return { background: "#e7f6ed", color: "#277947" };
  if (status === "Đang chuẩn bị")
    return { background: "#fff3d8", color: "#946717" };
  if (status === "Đang chọn")
    return { background: "#eaf1ff", color: "#3c67a5" };
  return { background: "#f0ebe8", color: "#75655c" };
};
const ClientOrderItem = () => {
  const [requestingSupport, setRequestingSupport] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [bill, setBill] = useState(null);
  const [hasBill, setHasBill] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [requestingPayment, setRequestingPayment] = useState(false);
  const [loadingBill, setLoadingBill] = useState(false);
  const navigate = useNavigate();
  const { tableId } = useParams();
  const paymentRedirected = useRef(false);
  const orderWasLoaded = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/tables/${tableId}`);
        if (!response.ok) {
          if (orderWasLoaded.current && !paymentRedirected.current) {
            paymentRedirected.current = true;
            setBillOpen(false);
            message.success("Thanh toán hoàn tất. Cảm ơn quý khách!");
            navigate(`/tables/${tableId}`, { replace: true });
          }
          return;
        }
        const data = await response.json();
        orderWasLoaded.current = true;
        setOrderItems(data?.orderItemResponseDTO || []);
        setOrderId(data?.orderId || 0);
        setCustomerName(data?.customerName || "");
        const billRes = await fetch(`${API_URL}/orders/${data?.orderId}/bill`);
        setHasBill(billRes.ok);
      } catch {
        // Không chuyển trang khi chỉ mất kết nối mạng tạm thời.
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 2000);
    return () => clearInterval(timer);
  }, [navigate, tableId]);
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/tables/${tableId}`);
        if (!response.ok) return;
        const table = await response.json();
        const normalizedStatus = (table?.tableStatus || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        const paymentCompleted =
          normalizedStatus.includes("da thanh toan") ||
          normalizedStatus.includes("dang trong") ||
          normalizedStatus.includes("ban trong");
        if (paymentCompleted && !paymentRedirected.current) {
          paymentRedirected.current = true;
          setBillOpen(false);
          message.success("Thanh toán hoàn tất. Cảm ơn quý khách!");
          navigate(`/tables/${tableId}`, { replace: true });
        }
      } catch {
        /* Giữ nguyên màn hình nếu máy chủ tạm thời mất kết nối. */
      }
    };
    checkPaymentStatus();
    const timer = setInterval(checkPaymentStatus, 2000);
    return () => clearInterval(timer);
  }, [navigate, tableId]);
  const requestSupport = async (id) => {
    setRequestingSupport((old) => ({ ...old, [id]: true }));
    try {
      const res = await fetch(
        `${API_URL}/orders/${orderId}/items/${id}/request`,
        { method: "POST", headers: { "Content-Type": "application/json" } },
      );
      if (!res.ok) throw new Error();
      message.success("Đã gọi nhân viên hỗ trợ");
    } catch {
      message.error("Không thể gửi yêu cầu hỗ trợ");
    } finally {
      setRequestingSupport((old) => ({ ...old, [id]: false }));
    }
  };
  const requestPayment = async () => {
    if (requestingPayment) return;
    setRequestingPayment(true);
    try {
      const res = await fetch(`${API_URL}/tables/${tableId}/payment/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      message.success("Đã gửi yêu cầu thanh toán");
    } catch {
      message.error("Không thể gửi yêu cầu thanh toán");
    } finally {
      setRequestingPayment(false);
    }
  };
  const getBill = async () => {
    if (loadingBill) return;
    setLoadingBill(true);
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/bill`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBill(data);
      setBillOpen(true);
    } catch {
      message.error("Hóa đơn chưa sẵn sàng");
    } finally {
      setLoadingBill(false);
    }
  };
  const allSelecting =
    orderItems.length > 0 &&
    orderItems.every((item) => item.dishStatus === "Đang chọn");
  return (
    <Page>
      <Headers>
        <BackButton onClick={() => navigate(`/order/${tableId}`)}>
          <ArrowLeftOutlined />
        </BackButton>
        <Titles>
          Đơn hàng
          <span>
            {customerName || "Khách hàng"} · Bàn số {tableId}
          </span>
        </Titles>
        <div />
      </Headers>
      <OrderHero>
        <div>
          <h1>Bếp đang chuẩn bị</h1>
          <p>Trạng thái món được cập nhật tự động mỗi 5 giây.</p>
        </div>
        <div className="hero-icon">
          <ShoppingOutlined />
        </div>
      </OrderHero>
      <OrderList>
        {orderItems.length ? (
          orderItems.map((item) => (
            <OrderCard key={item.orderItemId}>
              <div>
                <h3>{item.dishName}</h3>
                <div className="meta">
                  <span className="quantity">× {item.dishQuantity}</span>
                  <strong>
                    {Number(item.customPrice || 0).toLocaleString("vi-VN")}đ
                  </strong>
                  {item.dishNote && <span>· {item.dishNote}</span>}
                </div>
              </div>
              <div className="card-side">
                <StatusButton $tone={statusTone(item.dishStatus)}>
                  {item.dishStatus}
                </StatusButton>
                <SupportButton
                  disabled={requestingSupport[item.orderItemId]}
                  onClick={() => requestSupport(item.orderItemId)}
                >
                  <CustomerServiceOutlined />{" "}
                  {requestingSupport[item.orderItemId]
                    ? "Đang gọi..."
                    : "Hỗ trợ"}
                </SupportButton>
              </div>
            </OrderCard>
          ))
        ) : (
          <EmptyState>
            <span>🧾</span>Chưa có món nào trong đơn hàng.
          </EmptyState>
        )}
      </OrderList>
      <FooterButton>
        <ActionButton onClick={() => navigate(`/menu/${tableId}`)}>
          Thêm món
        </ActionButton>
        <ActionButton
          className="primary"
          disabled={!orderItems.length || allSelecting || requestingPayment}
          onClick={requestPayment}
        >
          {requestingPayment ? (
            <>
              <LoadingOutlined spin /> Đang gửi...
            </>
          ) : (
            <>
              <WalletOutlined /> Thanh toán
            </>
          )}
        </ActionButton>
        <ActionButton
          className="bill-button"
          disabled={
            !orderItems.length || allSelecting || !hasBill || loadingBill
          }
          onClick={getBill}
        >
          {loadingBill ? (
            <>
              <LoadingOutlined spin /> Đang tải...
            </>
          ) : (
            <>
              <FileTextOutlined /> Hóa đơn
            </>
          )}
        </ActionButton>
      </FooterButton>
      <Modal
        title="Chi tiết hóa đơn"
        open={billOpen}
        onCancel={() => setBillOpen(false)}
        footer={null}
        centered
        width={720}
      >
        <ContainerModal>
          <div className="receipt-head">
            <h2>TLU QUÁN</h2>
            <p>
              Khách hàng:{" "}
              <strong>
                {bill?.customerName || customerName || "Khách hàng"}
              </strong>{" "}
              · Bàn: <strong>{bill?.tableName || tableId}</strong>
              <br />
              Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội · Hotline: 0123 456
              789
            </p>
          </div>
          <StyledTable
            dataSource={bill?.billItemResponseDTOS || []}
            columns={[
              { title: "Tên món", dataIndex: "billItemName", key: "name" },
              { title: "SL", dataIndex: "billItemQuantity", key: "quantity" },
              {
                title: "Đơn giá",
                dataIndex: "billItemPrice",
                key: "price",
                render: (value) => Number(value || 0).toLocaleString("vi-VN"),
              },
              {
                title: "Thành tiền",
                key: "total",
                render: (_, record) =>
                  (
                    record.billItemQuantity * record.billItemPrice
                  ).toLocaleString("vi-VN"),
              },
            ]}
            pagination={false}
            rowKey="billItemId"
          />
          <div className="receipt-total">
            <span>Tổng thanh toán</span>
            <strong>
              {Number(bill?.totalAmount || 0).toLocaleString("vi-VN")}đ
            </strong>
          </div>
          <div className="receipt-time">
            Thời gian: {convertToTime(bill?.billDateTime)}
          </div>
        </ContainerModal>
      </Modal>
    </Page>
  );
};
export default ClientOrderItem;
