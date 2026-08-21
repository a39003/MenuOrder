import { Button, Form, Input, message, Modal } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { DishBottom, DishCard, DishImage, DishInfo, ModalContent } from "./style";
import { API_URL } from "../../../config";

const DishComponent = ({ dish, orderId, handleAddToCart }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [values, setValues] = useState({ dishId: dish.dishId, dishQuantity: 1, dishNote: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAvailable = Number(dish.dishStatus) === 1;

  const handleOrderClick = () => {
    setValues({ dishId: dish.dishId, dishQuantity: 1, dishNote: "" });
    setError(null);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (values.dishQuantity <= 0) {
      setError("Sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n 0");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ThÃªm mÃ³n khÃ´ng thÃ nh cÃ´ng");
      }
      handleAddToCart(values.dishQuantity);
      message.success("ÄÃ£ thÃªm mÃ³n vÃ o giá» hÃ ng");
      handleCancel();
    } catch (requestError) {
      setError(requestError.message || "ThÃªm mÃ³n khÃ´ng thÃ nh cÃ´ng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setError(null);
    form.resetFields();
  };

  return (
    <>
      <DishCard>
        <DishImage>
          <img src={dish.thumbnail} alt={dish.dishName} loading="lazy" />
          <span>{isAvailable ? "Sáºµn sÃ ng" : "Háº¿t mÃ³n"}</span>
        </DishImage>
        <DishInfo>
          <h3>{dish.dishName}</h3>
          <p>{dish.dishDescription || "MÃ³n ngon Ä‘Æ°á»£c chuáº©n bá»‹ tÆ°Æ¡i má»›i má»—i ngÃ y."}</p>
          <DishBottom>
            <strong>{Number(dish.dishPrice || 0).toLocaleString("vi-VN")}Ä‘</strong>
            <button aria-label={`ThÃªm ${dish.dishName}`} disabled={!isAvailable} onClick={handleOrderClick}>
              <PlusOutlined />
            </button>
          </DishBottom>
        </DishInfo>
      </DishCard>

      <Modal
        title={`ThÃªm ${dish.dishName}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="ThÃªm vÃ o giá»"
        cancelText="Há»§y"
        centered
        okButtonProps={{ style: { background: "#d96b2b" } }}
      >
        <ModalContent>
          <img className="dish-modal-image" src={dish.thumbnail} alt={dish.dishName} />
          <Form form={form} layout="vertical">
            <Form.Item label="Sá»‘ lÆ°á»£ng" required>
              <div className="quantity-row">
                <Button icon={<MinusOutlined />} onClick={() => setValues((old) => ({ ...old, dishQuantity: Math.max(old.dishQuantity - 1, 1) }))} />
                <span className="quantity-value">{values.dishQuantity}</span>
                <Button icon={<PlusOutlined />} onClick={() => setValues((old) => ({ ...old, dishQuantity: old.dishQuantity + 1 }))} />
              </div>
            </Form.Item>
            <Form.Item label="Ghi chÃº cho nhÃ  báº¿p">
              <Input.TextArea rows={3} value={values.dishNote} onChange={(event) => setValues({ ...values, dishNote: event.target.value })} placeholder="VÃ­ dá»¥: Ã­t cay, khÃ´ng hÃ nh..." />
            </Form.Item>
          </Form>
          {error && <p style={{ color: "#cf3d36", marginBottom: 0 }}>{error}</p>}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DishComponent;
