import React, { useEffect, useState } from "react";
import Modald from "../../costormer/Components/Modal/Modal";
import { Button, Form, InputNumber, Modal, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import InpuComponent from "../../costormer/Components/InputComponent/InputComponent";

const ListDish = ({ tableId }) => {
  const [visible, setVisible] = useState(false);
  const [orders, setOrders] = useState({ orderItemResponseDTO: [] });

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/orders/tables/${tableId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setOrders(data || { orderItemResponseDTO: [] });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [tableId]);




  const handleUpdateStatus = async (id) => {
    try {

      const itemToUpdate = orders.orderItemResponseDTO.find(
        (item) => item.orderItemId === id
      );
  
      if (!itemToUpdate) return;
  

      const updatedStatus =
        itemToUpdate.dishStatus === "Đang ra món" ? "Đã ra món" : "Đang ra món";
  

      const response = await fetch(
        `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dishStatus: updatedStatus }),
        }
      );
  
      const updatedData = await response.json();

      setOrders((prevOrders) => {
        const updatedItems = prevOrders.orderItemResponseDTO.map((item) =>
          item.orderItemId === id
            ? { ...item, dishStatus: updatedStatus } 
            : item
        );
        return { ...prevOrders, orderItemResponseDTO: updatedItems };
      });
    } catch (error) {
      console.error("Error updating order item status:", error);
    }
  };
  



  

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      const response = await fetch(
        `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ dishQuantity: newQuantity }),
        }
      );
      const updatedOrderItem = await response.json();
      updateOrderItem(updatedOrderItem);
    } catch (error) {
      console.error("Error updating order item quantity:", error);
    }
  };
  const handleNoteChange = (e) => {
    setOrders((prev) => ({ ...prev, dishNote: e.target.value }));
  };

  const updateOrderItem = (updatedOrderItem) => {
    setOrders((prevOrders) => {
      const updatedOrderItems = prevOrders.orderItemResponseDTO.map((item) =>
        item.orderItemId === updatedOrderItem.orderItemId
          ? { ...item, ...updatedOrderItem }
          : item
      );
      return { ...prevOrders, orderItemResponseDTO: updatedOrderItems };
    });
  };

  const columns = [
    {
      title: "Món ăn",
      dataIndex: "dishName",
      key: "dishName",
    },
    {
      title: "Số lượng",
      dataIndex: "dishQuantity",
      key: "dishQuantity",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }} >
          <Button
            onClick={() => handleUpdateQuantity(record.orderItemId, record.dishQuantity - 1)}
            disabled={record.dishQuantity <= 1 || record.dishStatus === "Đã ra món"}
            style={{ marginRight: 8 }}
          >
            -
          </Button>
          <InputNumber
            min={1}
            value={record.dishQuantity}
            onChange={(value) => handleUpdateQuantity(record.orderItemId, value)}
            style={{ width: "60px", marginRight: 8 }}
            disabled={record.dishStatus === "Đã ra món"}
          />
          <Button
            onClick={() => handleUpdateQuantity(record.orderItemId, record.dishQuantity + 1)}
            disabled={record.dishStatus === "Đã ra món"}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "customPrice",
      key: "customPrice",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Ghi chú",
      dataIndex: "dishNote",
      key: "dishNote",
    },
    {
      title: "Trạng thái",
      dataIndex: "dishStatus",
      key: "dishStatus",
    },
    {
      title: "Ra món",
      key: "action",
      render: (_, record) => {
        const isSelecting = record.dishStatus !== "Đang ra món" && record.dishStatus !== "Đã ra món";
        const isPreparing = record.dishStatus === "Đang ra món";
        const isServed = record.dishStatus === "Đã ra món";

        return (
          <Button
            type="primary"
            disabled={isSelecting || isServed}
            onClick={() => handleUpdateStatus(record.orderItemId)}
          >
            {isPreparing ? "Ra món" : isServed ? "Đã ra món" : "Đang chọn món"}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <EyeOutlined
        style={{ cursor: "pointer", fontSize: "20px" }}
        onClick={() => setVisible(!visible)}
      />
      <Modal
        title="Chi tiết đơn hàng"
        open={visible}
        onCancel={() => setVisible(false)}
        cancelText="Đóng"
        footer={null}
        width={1000}
      >
        <Form name="basic" autoComplete="off">
          <Table
            dataSource={orders.orderItemResponseDTO}
            columns={columns}
            pagination={false}
            size="small"
            rowKey="orderItemId"
          />

          <Form.Item style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button onClick={() => setVisible(false)} type="primary" htmlType="submit">
            Đóng
          </Button>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListDish;
