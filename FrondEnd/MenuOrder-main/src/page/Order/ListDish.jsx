import React, { useEffect, useState } from "react";
import { Button, InputNumber, Modal, Table, message } from "antd";
import {
  CheckOutlined,
  EyeOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  AdminIconButton,
  OrderModalHead,
  OrderStatusTag,
  QuantityControl,
} from "./style";
import { API_URL } from "../../config";

const ListDish = ({ tableId }) => {
  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState({ orderItemResponseDTO: [] });
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/orders/tables/${tableId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      setOrders(data || { orderItemResponseDTO: [] });
    } catch {
      if (visible) message.error("Không thể tải chi tiết đơn");
    }
  };
  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 5000);
    return () => clearInterval(timer);
  }, [tableId]);
  const updateStatus = async (id) => {
    const item = orders.orderItemResponseDTO.find(
      (entry) => entry.orderItemId === id,
    );
    if (!item) return;
    const dishStatus =
      item.dishStatus === "Đang ra món" ? "Đã ra món" : "Đang ra món";
    try {
      const response = await fetch(
        `${API_URL}/admin/orders/${orders.orderId}/items/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dishStatus }),
        },
      );
      if (!response.ok) throw new Error();
      setOrders((old) => ({
        ...old,
        orderItemResponseDTO: old.orderItemResponseDTO.map((entry) =>
          entry.orderItemId === id ? { ...entry, dishStatus } : entry,
        ),
      }));
      message.success("Đã cập nhật trạng thái món");
    } catch {
      message.error("Không thể cập nhật trạng thái");
    }
  };
  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) return;
    try {
      const response = await fetch(
        `${API_URL}/admin/orders/${orders.orderId}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dishQuantity: quantity }),
        },
      );
      const updated = await response.json();
      setOrders((old) => ({
        ...old,
        orderItemResponseDTO: old.orderItemResponseDTO.map((item) =>
          item.orderItemId === updated.orderItemId
            ? { ...item, ...updated }
            : item,
        ),
      }));
    } catch {
      message.error("Không thể cập nhật số lượng");
    }
  };
  const items = orders.orderItemResponseDTO || [];
  const columns = [
    {
      title: "Món ăn",
      dataIndex: "dishName",
      key: "dishName",
      render: (value, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.thumbnail ? (
            <img
              src={record.thumbnail}
              alt={value}
              style={{
                width: 52,
                height: 52,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #eee1d8",
              }}
            />
          ) : (
            <span
              style={{
                width: 52,
                height: 52,
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                background: "#fff0e5",
                color: "#c65b27",
                fontWeight: 900,
              }}
            >
              {value?.trim()?.charAt(0)?.toUpperCase() || "M"}
            </span>
          )}
          <strong>{value}</strong>
        </div>
      ),
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_, record) => {
        const locked = record.dishStatus === "Đã ra món";
        return (
          <QuantityControl>
            <Button
              icon={<MinusOutlined />}
              disabled={locked || record.dishQuantity <= 1}
              onClick={() =>
                updateQuantity(record.orderItemId, record.dishQuantity - 1)
              }
            />
            <InputNumber
              controls={false}
              min={1}
              disabled={locked}
              value={record.dishQuantity}
              onChange={(value) => updateQuantity(record.orderItemId, value)}
            />
            <Button
              icon={<PlusOutlined />}
              disabled={locked}
              onClick={() =>
                updateQuantity(record.orderItemId, record.dishQuantity + 1)
              }
            />
          </QuantityControl>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "customPrice",
      key: "price",
      render: (value) => (
        <strong style={{ color: "#c65b27" }}>
          {Number(value || 0).toLocaleString("vi-VN")}đ
        </strong>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "dishNote",
      key: "note",
      render: (value) => (
        <span style={{ color: value ? "#594238" : "#b5a69e" }}>
          {value || "Không có"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "dishStatus",
      key: "status",
      render: (value) => (
        <OrderStatusTag $done={value === "Đã ra món"}>{value}</OrderStatusTag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        const preparing = record.dishStatus === "Đang ra món";
        const served = record.dishStatus === "Đã ra món";
        return (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={!preparing || served}
            onClick={() => updateStatus(record.orderItemId)}
          >
            {served
              ? "Đã phục vụ"
              : preparing
                ? "Xác nhận ra món"
                : "Chờ khách chốt"}
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <AdminIconButton
        aria-label="Xem món khách đặt"
        onClick={() => setVisible(true)}
      >
        <EyeOutlined />
      </AdminIconButton>
      <Modal
        title="Chi tiết món khách đặt"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={1050}
      >
        <OrderModalHead>
          <div>
            <h3>
              Bàn {tableId} · {orders.customerName || "Khách hàng"}
            </h3>
            <span className="sub">
              Theo dõi và cập nhật món theo thời gian thực
            </span>
          </div>
          <span className="count">
            {items.reduce(
              (sum, item) => sum + Number(item.dishQuantity || 0),
              0,
            )}{" "}
            món
          </span>
        </OrderModalHead>
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          rowKey="orderItemId"
          scroll={{ x: 820 }}
          locale={{ emptyText: "Chưa có món nào trong đơn" }}
        />
        <div style={{ textAlign: "right", marginTop: 18 }}>
          <Button onClick={() => setVisible(false)}>Đóng</Button>
        </div>
      </Modal>
    </>
  );
};
export default ListDish;
