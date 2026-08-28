import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { message, Spin } from "antd";
import { apiFetch } from "../../services/auth";
import { KitchenBoard, KitchenLane, KitchenPage, KitchenTicket } from "./style";

const lanes = [
  { key: "Đang chọn", title: "Mới nhận", next: "Đang chế biến", action: "Bắt đầu chế biến" },
  { key: "Đang chế biến", title: "Đang chế biến", next: "Chờ phục vụ", action: "Món đã xong" },
  { key: "Chờ phục vụ", title: "Chờ phục vụ", next: "Đã ra món", action: "Đã mang ra" },
  { key: "Đã ra món", title: "Đã phục vụ", next: null, action: "Hoàn tất" },
];

const normalizeStatus = (status) => status === "Đang ra món" ? "Đang chọn" : status;

const Kitchen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(() => new Set());
  const [updatedAt, setUpdatedAt] = useState(null);
  const pendingStatuses = useRef(new Map());

  const loadKitchen = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await apiFetch("/admin/orders?page=0&size=30");
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Không tải được danh sách món của bếp");
      const orders = Array.isArray(data?.orderResponseDTOList) ? data.orderResponseDTOList : [];
      const activeOrders = orders.filter((order) => !["Đã thanh toán", "Đã hủy"].includes(order.orderStatus));
      const nextItems = activeOrders.flatMap((order) => (order.orderItemResponseDTO || []).map((item) => {
        const serverStatus = normalizeStatus(item.dishStatus);
        const pending = pendingStatuses.current.get(item.orderItemId);
        if (pending && (pending.status === serverStatus || Date.now() > pending.expiresAt)) {
          pendingStatuses.current.delete(item.orderItemId);
        }
        return {
          ...item,
          dishStatus: pending && Date.now() <= pending.expiresAt ? pending.status : serverStatus,
          orderId: order.orderId,
          tableName: order.tableName,
          customerName: order.customerName,
          orderTime: order.orderTime,
        };
      }));
      setItems(nextItems);
      setUpdatedAt(new Date());
    } catch (error) {
      if (!silent) message.error(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKitchen();
    const timer = setInterval(() => loadKitchen(true), 15000);
    return () => clearInterval(timer);
  }, [loadKitchen]);

  const grouped = useMemo(() => Object.fromEntries(lanes.map((lane) => [
    lane.key,
    items.filter((item) => item.dishStatus === lane.key),
  ])), [items]);

  const changeStatus = async (item, nextStatus) => {
    if (!nextStatus || updating.has(item.orderItemId)) return;
    setUpdating((current) => new Set(current).add(item.orderItemId));
    pendingStatuses.current.set(item.orderItemId, {
      status: nextStatus,
      expiresAt: Date.now() + 30000,
    });
    setItems((current) => current.map((entry) => entry.orderItemId === item.orderItemId
      ? { ...entry, dishStatus: nextStatus } : entry));
    try {
      const response = await apiFetch(`/admin/orders/${item.orderId}/items/${item.orderItemId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishStatus: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Không thể cập nhật món");
      message.success(`${item.dishName}: ${nextStatus}`);
    } catch (error) {
      pendingStatuses.current.delete(item.orderItemId);
      await loadKitchen(true);
      message.error(error.message);
    } finally {
      setUpdating((current) => {
        const next = new Set(current);
        next.delete(item.orderItemId);
        return next;
      });
    }
  };

  const elapsed = (value) => {
    if (!value) return "Vừa nhận";
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
    return `${minutes} phút`;
  };

  return <KitchenPage>
    <div className="kitchen-head">
      <div><h1>Khu vực bếp</h1><p className="subtitle">Theo dõi và chuyển trạng thái từng món theo tiến độ chế biến.</p></div>
      <span className="updated">{updatedAt ? `Cập nhật ${updatedAt.toLocaleTimeString("vi-VN")}` : "Đang đồng bộ"}</span>
    </div>
    {loading ? <div style={{ display:"grid", placeItems:"center", minHeight:300 }}><Spin size="large" /></div> :
      <KitchenBoard>{lanes.map((lane) => <KitchenLane key={lane.key}>
        <div className="lane-head"><h2>{lane.title}</h2><span className="count">{grouped[lane.key]?.length || 0}</span></div>
        {!grouped[lane.key]?.length && <div className="empty">Chưa có món</div>}
        {grouped[lane.key]?.map((item) => <KitchenTicket key={item.orderItemId} $done={!lane.next}>
          <div className="ticket-top"><span className="table">{item.tableName || "Chưa rõ bàn"}</span><span className="time">{elapsed(item.orderTime)}</span></div>
          <h3><span className="qty">{item.dishQuantity}×</span> {item.dishName}</h3>
          <div className="note">{item.dishNote || "Không có ghi chú"}</div>
          <button disabled={!lane.next || updating.has(item.orderItemId)} onClick={() => changeStatus(item, lane.next)}>
            {updating.has(item.orderItemId) ? "Đang cập nhật..." : lane.action}
          </button>
        </KitchenTicket>)}
      </KitchenLane>)}</KitchenBoard>}
  </KitchenPage>;
};

export default Kitchen;
