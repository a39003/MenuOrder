import React, { useEffect, useMemo, useState } from "react";
import { Input, message } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  FileTextOutlined,
  LoadingOutlined,
  RightOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  Actions,
  CartIntro,
  CartItem,
  Container,
  Details,
  EmptyCart,
  Footer,
  FooterButton,
  HeaderButton,
  Headers,
  ItemIcon,
  ListContainer,
  Summary,
  Titles,
} from "./style";
import { API_URL } from "../../../config";
import CustomerSupport from "../CustomerSupport/CustomerSupport";

const ClientOrder = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [tableName, setTableName] = useState(
    sessionStorage.getItem(`table-name-${tableId}`) || "",
  );
  const [notes, setNotes] = useState({});
  const [sending, setSending] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});
  useEffect(() => {
    fetch(`${API_URL}/tables/${tableId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.tableName) return;
        setTableName(data.tableName);
        sessionStorage.setItem(`table-name-${tableId}`, data.tableName);
      })
      .catch(() => {});
  }, [tableId]);
  useEffect(() => {
    const fetchData = () =>
      fetch(`${API_URL}/orders/tables/${tableId}`)
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((data) => {
          setOrderItems(data?.orderItemResponseDTO || []);
          setOrderId(data?.orderId || 0);
          setCustomerName(data?.customerName || "");
        })
        .catch(() => {
          setOrderItems([]);
          setOrderId(0);
        });
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, [tableId]);
  const totalItems = useMemo(
    () =>
      orderItems.reduce((sum, item) => sum + Number(item.dishQuantity || 0), 0),
    [orderItems],
  );
  const totalPrice = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) =>
          sum + Number(item.customPrice || 0) * Number(item.dishQuantity || 0),
        0,
      ),
    [orderItems],
  );
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    if (updatingItems[id]) return;
    setUpdatingItems((old) => ({ ...old, [id]: true }));
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishQuantity: quantity }),
      });
      const data = await res.json();
      setOrderItems((items) =>
        items.map((item) =>
          item.orderItemId === data.orderItemId ? data : item,
        ),
      );
    } catch {
      message.error("Không thể cập nhật số lượng");
    } finally {
      setUpdatingItems((old) => ({ ...old, [id]: false }));
    }
  };
  const saveNote = (item) =>
    fetch(`${API_URL}/orders/${orderId}/items/${item.orderItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dishNote: notes[item.orderItemId] ?? item.dishNote ?? "",
        dishQuantity: item.dishQuantity,
      }),
    }).catch(() => message.error("Không thể lưu ghi chú"));
  const removeItem = async (id) => {
    if (updatingItems[id]) return;
    setUpdatingItems((old) => ({ ...old, [id]: true }));
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/items/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      setOrderItems((items) => items.filter((item) => item.orderItemId !== id));
      message.success("Đã xóa món khỏi giỏ");
    } catch {
      message.error("Không thể xóa món");
    } finally {
      setUpdatingItems((old) => ({ ...old, [id]: false }));
    }
  };
  const sendOrder = async () => {
    if (sending) return;
    setSending(true);
    const items = orderItems.map((item) => ({
      dishId: item.dishId,
      quantity: item.dishQuantity,
      notes: notes[item.orderItemId] || item.dishNote || "",
    }));
    try {
      const res = await fetch(`${API_URL}/orders/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.orderId) {
        message.success("Đã gửi món tới nhà bếp");
        navigate(`/orderitem/${tableId}`);
      }
    } catch {
      message.error("Gửi đơn chưa thành công, vui lòng thử lại");
    } finally {
      setSending(false);
    }
  };
  return (
    <Container>
      <Headers>
        <HeaderButton onClick={() => navigate(`/menu/${tableId}`)}>
          <ArrowLeftOutlined />
        </HeaderButton>
        <Titles>
          Giỏ hàng
          <span>
            {customerName || "Khách hàng"} ·{" "}
            {tableName || "Đang tải tên bàn..."}
          </span>
        </Titles>
        <HeaderButton onClick={() => navigate(`/orderitem/${tableId}`)}>
          <RightOutlined />
        </HeaderButton>
      </Headers>
      <CartIntro>
        <div>
          <h1>Món bạn đã chọn</h1>
          <p>Kiểm tra số lượng và ghi chú trước khi gửi bếp.</p>
        </div>
        <span className="count">{totalItems} món</span>
      </CartIntro>
      <ListContainer>
        {orderItems.length ? (
          orderItems.map((item) => (
            <CartItem key={item.orderItemId}>
              <ItemIcon>
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.dishName} />
                ) : (
                  item.dishName?.trim()?.charAt(0)?.toUpperCase() || (
                    <ShoppingOutlined />
                  )
                )}
              </ItemIcon>
              <Details>
                <h3>{item.dishName}</h3>
                <span className="price">
                  {Number(item.customPrice || 0).toLocaleString("vi-VN")}đ
                </span>
                <div className="note">
                  <Input
                    prefix={<FileTextOutlined style={{ color: "#b29381" }} />}
                    placeholder="Thêm ghi chú: ít cay, không hành..."
                    value={notes[item.orderItemId] ?? item.dishNote ?? ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [item.orderItemId]: e.target.value })
                    }
                    onBlur={() => saveNote(item)}
                  />
                </div>
              </Details>
              <Actions className="item-actions">
                <div className="stepper">
                  <button
                    disabled={updatingItems[item.orderItemId]}
                    onClick={() =>
                      updateQuantity(item.orderItemId, item.dishQuantity - 1)
                    }
                  >
                    −
                  </button>
                  <strong>{item.dishQuantity}</strong>
                  <button
                    disabled={updatingItems[item.orderItemId]}
                    onClick={() =>
                      updateQuantity(item.orderItemId, item.dishQuantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="delete"
                  aria-label="Xóa món"
                  disabled={item.dishStatus !== "Đang chọn"}
                  onClick={() => removeItem(item.orderItemId)}
                >
                  {updatingItems[item.orderItemId] ? (
                    <LoadingOutlined spin />
                  ) : (
                    <DeleteOutlined />
                  )}
                </button>
              </Actions>
            </CartItem>
          ))
        ) : (
          <EmptyCart>
            <span>🍽️</span>Giỏ hàng đang trống. Hãy chọn thêm món ngon nhé.
          </EmptyCart>
        )}
      </ListContainer>
      {!!orderItems.length && (
        <Summary>
          <div className="row">
            <span>Số lượng</span>
            <strong>{totalItems} món</strong>
          </div>
          <div className="row total">
            <span>Tạm tính</span>
            <strong>{totalPrice.toLocaleString("vi-VN")}đ</strong>
          </div>
        </Summary>
      )}
      <Footer>
        <FooterButton onClick={() => navigate(`/menu/${tableId}`)}>
          Thêm món
        </FooterButton>
        <FooterButton
          className="primary"
          disabled={!orderItems.length || sending}
          onClick={sendOrder}
        >
          {sending ? (
            <>
              <LoadingOutlined spin />
              &nbsp; Đang gửi món...
            </>
          ) : (
            <>
              Gửi món tới bếp&nbsp; <RightOutlined />
            </>
          )}
        </FooterButton>
      </Footer>
      <CustomerSupport tableId={tableId} />
    </Container>
  );
};
export default ClientOrder;
