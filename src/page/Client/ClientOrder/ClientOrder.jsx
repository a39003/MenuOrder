import React, { useEffect, useState } from "react";
import { Button, List, Typography, Row, Input, message, Tooltip } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container, Headers, Titles, ListContainer, ItemContainer, Actions, Details, Footer, FooterButton, RemoveButton } from "./style";

const ClientOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [hasOrder, setHasOrder] = useState(false);
  const [notes, setNotes] = useState({});
  const [totalItems, setTotalItems] = useState(0); 

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    let intervalId;

    const fetchData = () => {
      if (params.tableId) {
        fetch(`http://localhost:8080/orders/tables/${params.tableId}`)
          .then((res) => {
            if (res.status === 500) {
              throw new Error("No order found");
            }
            return res.json();
          })
          .then((data) => {
            setOrderItems(data?.orderItemResponseDTO ? data?.orderItemResponseDTO : []);
            setOrderId(data?.orderId ? data?.orderId : 0);
            setHasOrder(true);
          })
          .catch(() => {
            setOrderItems([]);
            setOrderId(0);
            setHasOrder(false);
            console.log("Bàn trống");
          });
      }
    };

    const startInterval = () => {
      intervalId = setInterval(fetchData, 5000); 
    };

    const stopInterval = () => {
      clearInterval(intervalId);
    };

    fetchData();
    startInterval(); 

    return () => {
      stopInterval();
    };
  }, [params.tableId]);

  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.dishQuantity, 0);
    setTotalItems(total);
  }, [orderItems]);

  const handleNoteChange = (orderItemId, newNote) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [orderItemId]: newNote,
    }));
  };

  const handleSaveNote = (orderItemId, newNote, quantity) => {
    fetch(`http://localhost:8080/orders/${orderId}/items/${orderItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dishNote: newNote,
        dishQuantity: quantity
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrderItems((prevOrderItems) =>
          prevOrderItems.map((item) =>
            item.orderItemId === orderItemId
              ? { ...item, dishNote: newNote }
              : item
          )
        );
      })
      .catch((err) => alert("Error saving note: " + err.message));
  };

  const handleDeleteItem = (id) => {
    fetch(`http://localhost:8080/orders/${orderId}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setOrderItems((prevOrderItems) =>
            prevOrderItems.filter((item) => item.orderItemId !== id)
          );
          message.success("Xóa món ăn thành công");
        } else {
          message.error("Xóa món ăn thất bại");
        }
      })
      .catch((err) => alert(err));
  };

  const handleSendOrder = () => {
    const updatedItems = orderItems.map((item) => ({
      dishId: item.dishId,
      quantity: item.dishQuantity,
      notes: notes[item.orderItemId] || item.dishNote || "", 
    }));
  
    fetch(`http://localhost:8080/orders/${params.tableId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: updatedItems, 
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send order");
        }
        return res.json();
      })
      .then((data) => {
        if (data.orderId) {
          message.success("Gửi order thành công");
          navigate(`/orderitem/${params.tableId}`);
        }
      })
      .catch((error) => {
        console.error("Error sending order:", error);
        message.error("Gửi order thất bại, vui lòng thử lại.");
      });
  };

  const handleUpdateQuantity = async (orderItemId, quantity) => {
    if (quantity > 0) {
      await fetch(
        `http://localhost:8080/orders/${orderId}/items/${orderItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dishQuantity: quantity,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setOrderItems((prevOrderItems) =>
            prevOrderItems.map((item) =>
              item.orderItemId === data.orderItemId ? data : item
            )
          );
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <Container>
      <Headers>
        <ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate(`/menu/${params.tableId}`)} />
        <Titles level={4}>GIỎ HÀNG</Titles>
        <ArrowRightOutlined  style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate(`/orderitem/${params.tableId}`)} />
      </Headers>

      <ListContainer >
        <List
          dataSource={orderItems}
          renderItem={(orderItem) => (
            <List.Item key={orderItem.orderItemId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
              <ItemContainer>
                <Details >
                <Tooltip title={orderItem.dishName}>
                  <Typography.Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "150px", // Adjust this width to fit your layout
                    }}
                  >
                    {orderItem.dishName.length > 7 ? orderItem.dishName.slice(0, 7) + "..." : orderItem.dishName}
                  </Typography.Text>
                </Tooltip>
                  <Typography.Text style={{ fontSize: "12px", color: "#999" }}>
                    {orderItem.customPrice.toLocaleString()}đ
                  </Typography.Text>
                </Details>
              </ItemContainer>
              <Actions>
                <Button onClick={() => handleUpdateQuantity(orderItem.orderItemId, orderItem.dishQuantity - 1)}>-</Button>
                <Input
                  type="number"
                  value={orderItem.dishQuantity}
                  onChange={(e) => handleUpdateQuantity(orderItem.orderItemId, parseInt(e.target.value))}
                  style={{ width: "50px", textAlign: "center" }}
                />
                <Button onClick={() => handleUpdateQuantity(orderItem.orderItemId, orderItem.dishQuantity + 1)}>+</Button>
              </Actions>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <RemoveButton type="text" danger
                  disabled={orderItem.dishStatus !== "Đang chọn"}
                  onClick={() => handleDeleteItem(orderItem.orderItemId)}>Xóa</RemoveButton>
                <Input
                  type="text"
                  style={{ width: "90px", height: "40px" }}
                  value={notes[orderItem.orderItemId] || orderItem.dishNote || ""}
                  onChange={(e) =>
                    handleNoteChange(orderItem.orderItemId, e.target.value)
                  }
                  onBlur={() => handleSaveNote(orderItem.orderItemId, notes[orderItem.orderItemId] || orderItem.dishNote || "", orderItem.dishQuantity)}
                />
              </div>
            </List.Item>
          )}
        />
      </ListContainer>
      <Footer>
        <Row justify="space-between">
          <FooterButton type="default" onClick={() => navigate(`/menu/${params.tableId}`)}>
            Menu
          </FooterButton>
          <FooterButton type="primary" onClick={handleSendOrder}>
            Đặt Món
          </FooterButton>
        </Row>
      </Footer>
    </Container>
  );
};

export default ClientOrder;
