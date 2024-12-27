import React, { useEffect, useState } from "react";
import { Button, List, Badge, message, Table, Typography, Modal, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonOrder, ButtonPayment, FooterButton, Headers, StatusButton, Titles, StyledTable, ContainerModal } from "./style";
import Title from "antd/es/skeleton/Title";
import { convertToTime } from "../../../costormer/Time/time";

const ClientOrderItem = () => {
  const [supportRequest, setSupportRequest] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [tableId, setTableId] = useState(0);
  const [hasOrder, setHasOrder] = useState(false);
  const [bill, setBill] = useState(null);
  const [hasBill, setHasBill] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (params.tableId) {
        try {
          const response = await fetch(`http://localhost:8080/orders/tables/${params?.tableId}`);
          if (!response.ok) {
            throw new Error("No order found");
          }
          const data = await response.json();
          setOrderItems(data?.orderItemResponseDTO || []);
          setOrderId(data?.orderId || 0);
          setHasOrder(true);
  
          // Kiểm tra xem có hóa đơn hay không
          const billResponse = await fetch(`http://localhost:8080/orders/${data?.orderId}/bill`);
          if (billResponse.ok) {
            setHasBill(true);
          } else {
            setHasBill(false);
          }
        } catch (error) {
          console.error("Error fetching order items:", error);
          setOrderItems([]);
          setOrderId(0);
          setHasOrder(false);
          setHasBill(false);
        }
      }
    };
  
    fetchData();
  
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [params.tableId]);

  const handleRequest = async (id) => {
    if (!id) {
      message.error("ID món ăn không hợp lệ.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/orders/${orderId}/items/${id}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        message.success("Yêu cầu hỗ trợ món ăn thành công");
      } else {
        throw new Error("Error in support request");
      }
    } catch (error) {
      console.error("Error sending support request:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu hỗ trợ");
    }
  };




  const handlePaymentRequest = async () => {
    try {
      const response = await fetch(`http://localhost:8080/tables/${params.tableId}/payment/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        message.success("Đã gửi yêu cầu thanh toán");
      } else {
        throw new Error("Error in payment request");
      }
    } catch (error) {
      console.error("Error sending payment request:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu thanh toán");
    }
  };

  const handleGetBill = () => {
    fetch(`http://localhost:8080/orders/${orderId}/bill`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 500) {
            throw new Error("Đơn hàng này chưa có hóa đơn");
          } else {
            throw new Error("Lỗi không xác định");
          }
        }
        return res.json();
      })
      .then((data) => {
        setBill(data);
        setIsBillDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching bill:", error);
        if (error.message === "Đơn hàng này chưa có hóa đơn") {
          message.error("Chưa có hóa đơn");
        }
        setBill(null);
        setIsBillDialogOpen(false);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "green";
      case "Đang chuẩn bị":
        return "#FFD700";
      default:
        return "#d9d9d9";
    }
  };

  const allItemsAreSelecting = orderItems.every(
    (item) => item.dishStatus === "Đang chọn"
  );
  const allItemsAreDone = orderItems.every(
    (item) => item.dishStatus === "Đã ra món"
  );

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxSizing: "border-box",
      }}
    >
      <Headers>
        <ArrowLeftOutlined
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => navigate(`/order/${params.tableId}`)}
        />
        <Titles level={4} style={{marginLeft:"90px"}}>ĐƠN HÀNG</Titles>
      </Headers>

      <List
      dataSource={orderItems}
      renderItem={(orderItem) => (
        <List.Item
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <div>
              <h4 style={{ margin: 0, fontWeight: "bold" }}>{orderItem.dishName}</h4>
              <p style={{ margin: "4px 0", color: "#888" }}>
                {orderItem.customPrice.toLocaleString()}đ
              </p>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Button
                disabled={supportRequest[orderItem.orderItemId]}
                onClick={() => handleRequest(orderItem.orderItemId)}
                style={{
                  width: "auto",
                  maxWidth: "150px",
                }}
              >
                Hỗ trợ
              </Button>
            </div>
          </div>
    
          <div style={{ textAlign: "center" }}>
            <Badge
              count={orderItem.dishQuantity}
              style={{
                backgroundColor: "#F5DDDD",
                color: "#000",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            />
            <StatusButton
              style={{
                background: getStatusColor(orderItem.dishStatus),
                color: "#000",
              }}
            >
              {orderItem.dishStatus}
            </StatusButton>
          </div>
        </List.Item>
      )}
    />
    

      <FooterButton style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <ButtonOrder onClick={() => navigate(`/menu/${params.tableId}`)} style={{ flex: 1 }}>
          Menu
        </ButtonOrder>
        <ButtonPayment
          onClick={handlePaymentRequest}
          disabled={orderItems.length === 0 || allItemsAreSelecting}
          style={{ flex: 1 }}
        >
          Thanh Toán
        </ButtonPayment>
        <ButtonOrder
        onClick={handleGetBill}
        disabled={orderItems.length === 0 || allItemsAreSelecting || !hasBill}
        style={{ flex: 1 }}
      >
        Xem Bill
      </ButtonOrder>
      </FooterButton>

      <Modal
      title="Chi Tiết Hóa Đơn"
      visible={isBillDialogOpen}
      onCancel={() => setIsBillDialogOpen(false)}
      footer={null}
      centered
      width="90%" 
    >
      <ContainerModal

      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          TLU QUÁN
        </Title>
        <Typography.Text style={{ display: "block", textAlign: "center" }}>
         Địa Chỉ: Nghiêm Xuân Yên - Đại Kim - Hoàng Mai - Hà Nội <br />
         SDT: 012345678
        </Typography.Text>

        <StyledTable
          dataSource={bill?.billItemResponseDTOS || []}
          columns={[
            {
              title: "Tên món",
              dataIndex: "billItemName",
              key: "billItemName",
            },
            {
              title: "Số lượng",
              dataIndex: "billItemQuantity",
              key: "billItemQuantity",
            },
            {
              title: "Giá tiền",
              dataIndex: "billItemPrice",
              key: "billItemPrice",
              render: (billItemPrice) => billItemPrice?.toLocaleString() || "-",
            },
            {
              title: "Thành tiền",
              key: "totalPrice",
              render: (text, record) => {
                const total = record.billItemQuantity * record.billItemPrice;
                return total.toLocaleString();
              },
            },
          ]}
          pagination={false}
          rowKey="billItemId"
          bordered
        />
        <div style={{ marginTop: "12px", fontWeight: "bold" }}>
          Tổng tiền: {bill?.totalAmount?.toLocaleString() || 0} VND
        </div>
        <div style={{ marginTop: "12px", fontWeight: "bold" }}>
          Thời gian: {convertToTime(bill?.billDateTime)}
        </div>
      </ContainerModal>
    </Modal>
  </div>
);
};

export default ClientOrderItem;
