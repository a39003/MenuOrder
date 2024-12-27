import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Layout } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Headers, Titles } from "./style";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { convertToTime } from "../../../costormer/Time/time";

const { Title } = Typography;

const ClientBill = () => {
  const params = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [hasOrder, setHasOrder] = useState(false);
  const [bill, setBill] = useState(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

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
      intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds
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
    const fetchOrderUpdates = () => {
      fetch("http://localhost:8080/orders/updates")
        .then((res) => res.json())
        .then((updatedOrder) => {
          if (updatedOrder) {
            setOrderItems((prevOrderItems) =>
              prevOrderItems.map((item) =>
                item.orderItemId === updatedOrder.orderItemId
                  ? updatedOrder
                  : item
              )
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching order updates:", error);
        });
    };
  
    const intervalId = setInterval(fetchOrderUpdates, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleCreateOrder = async () => {
    await fetch(`http://localhost:8080/${params.tableId}/menus`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
          alert("Tạo order thành công");
          navigate(`/menu/${params.tableId}`);
        }
      });
  };

  const handleSendOrder = () => {
    fetch(`http://localhost:8080/orders/${params.tableId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orderId) {
          alert("Gửi order thành công");
          setOrderItems((prevOrderItems) =>
            prevOrderItems.map((item) => ({
              ...item,
              dishStatus: "Đang ra món",
            }))
          );
        }
      });
  };

  const handleRequest = (id) => {
    fetch(`http://localhost:8080/orders/${orderId}/items/${id}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => alert("Yêu cầu hỗ trợ món ăn thành công"))
      .catch((err) => alert(err));
  };

  const handlePaymentRequest = () => {
    fetch(`http://localhost:8080/tables/${params.tableId}/payment/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => alert("Đã gửi yêu cầu thanh toán"))
      .catch((err) => alert(err));
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
          alert("Đơn hàng này chưa có hóa đơn");
        }
        setBill(null);
        setIsBillDialogOpen(false);
      });
  };  



  const dataSource = [
    {
      key: "1",
      name: "Bò sốt tiêu đen",
      quantity: 2,
      price: 239000,
      total: 478000,
    },
    {
      key: "2",
      name: "Dê tái chanh",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "3",
      name: "Bò xào rau muống",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "4",
      name: "Dê hấp",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "5",
      name: "Thịt lợn quay",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "6",
      name: "Chân giò hầm",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
  ];

  const columns = [
    {
      title: "Tên món",
      dataIndex: "billItemName",
      key: "billItemName",
    },
    {
      title: "SL",
      dataIndex: "billItemQuantity",
      key: "billItemQuantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "billItemPrice",
      key: "billItemPrice",
      render: (billItemPrice) => billItemPrice?.toLocaleString("vi-VN"),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => total.toLocaleString("vi-VN"),
    },
  ];

  const totalAmount = dataSource.reduce((sum, item) => sum + item.total, 0);
  const navigate = useNavigate()

  return (
    <Layout
      style={{
        background: "#fff",
        padding: 20,
        width: 400,
        margin: "0 auto",
        borderRadius: 10,
      }}
    >
    <Headers >
      <ArrowLeftOutlined style={{fontSize:'20px', marginLeftL:'1px', cursor:'pointer'}} onClick={() => navigate(`/orderitem/${params.tableId}`)}/>
      <Titles level={4} >
          MY ORDERED ITEMS
      </Titles>
    </Headers>
      <Title level={3} style={{ textAlign: "center" }}>
        Hóa đơn
      </Title>
      <div>
      <Table
      dataSource={bill?.billItemResponseDTOS || []}
      columns={columns}
      pagination={false}
      bordered
      summary={() =>
        {bill && (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <b>Tổng Tiền:</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{bill.totalAmount?.toLocaleString("vi-VN")} Đ</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <b>Thời gian:</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{convertToTime(bill.billDateTime)}</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        ) }
      }
    />
    
      </div>
    </Layout>
  );
};

export default ClientBill
