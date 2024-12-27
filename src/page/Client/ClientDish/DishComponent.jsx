import { Button, Card, Form, Input, InputNumber, message, Modal } from "antd";
import React, { useState } from "react";
import {PlusOutlined} from "@ant-design/icons"

const DishComponent = ({ dish, orderId, handleAddToCart  }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [values, setValues] = useState({
    dishId: dish.dishId,
    dishQuantity: 1,
    dishNote: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOrderClick = () => {
    setValues({
      dishId: dish.dishId,
      dishQuantity: 1,
      dishNote: "",
    });
    setError(null);
    setIsModalVisible(true);
  };

  const handleOk = async (quantity) => {
      quantity = 1
      handleAddToCart(quantity)
    if (values.dishQuantity <= 0) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/orders/${orderId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thêm món không thành công");
      }

      message.success("Món ăn đã được thêm vào giỏ hàng.");
      handleCancel();
    } catch (error) {
      console.error("Error adding dish:", error);
      setError(error.message || "Thêm món không thành công");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setError(null);
    form.resetFields();
  };

  // Functions to increment and decrement the quantity
  const incrementQuantity = () => {
    setValues((prevValues) => ({
      ...prevValues,
      dishQuantity: prevValues.dishQuantity + 1,
    }));
  };

  const decrementQuantity = () => {
    setValues((prevValues) => ({
      ...prevValues,
      dishQuantity: Math.max(prevValues.dishQuantity - 1, 1),
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        gap: "15px",
      }}
    >
      {/* Hình ảnh món ăn */}
      <img
        src={dish.thumbnail}
        alt={dish.dishName}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "10px",
          objectFit: "cover",
        }}
      />

      {/* Thông tin món ăn */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#000",
            marginBottom: "5px",
          }}
        >
          {dish.dishName}
        </div>
        <div style={{ color: "orange", fontSize: "12px" }}>
          {dish.dishPrice.toLocaleString()} VND
        </div>
      </div>

      {dish.dishStatus == 1 ? (
        <Button
          type="default"
          shape="circle"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: "#ffffff",
            color: "#ff7f50",
            border: "1px solid #ff7f50",
          }}
            onClick={handleOrderClick}
            loading={loading}
        />
      ) : (
        <div style={{ color: "red", fontSize: "12px" }}>Hết món</div>
      )}


      <Modal
        title={`Đặt món: ${dish.dishName}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Thêm món"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" initialValues={values}>
          <Form.Item>
              <img
              src={dish.thumbnail}
              alt={dish.dishName}
              style={{
                width: "310px",
                height: "180px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </Form.Item>
          <Form.Item label="Số lượng" required>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="default"
                onClick={decrementQuantity}
                style={{ width: "20px", height: "30px" }}
              >
                -
              </Button>
              <Input
                style={{
                  textAlign: "center",
                  width: "50px",
                  margin: "0 10px",
                }}
                value={values.dishQuantity}
                readOnly
              />
              <Button
                type="default"
                onClick={incrementQuantity}
                style={{ width: "30px", height: "30px" }}
              >
                +
              </Button>
            </div>
          </Form.Item>

          <Form.Item label="Ghi chú">
            <Input.TextArea
              rows={2}
              value={values.dishNote}
              onChange={(e) =>
                setValues({ ...values, dishNote: e.target.value })
              }
              placeholder="Thêm ghi chú cho món ăn (nếu có)"
            />
          </Form.Item>
        </Form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </Modal>
    </div>
  );
};

export default DishComponent;
