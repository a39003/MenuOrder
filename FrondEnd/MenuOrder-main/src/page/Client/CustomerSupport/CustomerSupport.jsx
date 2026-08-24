import React, { useState } from "react";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import styled from "styled-components";
import { API_URL } from "../../../config";

const reasons = [
  "Gọi nhân viên",
  "Cần thêm dụng cụ",
  "Cần dọn bàn",
  "Món ăn có vấn đề",
  "Yêu cầu khác",
];

const CustomerSupport = ({ tableId }) => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState(reasons[0]);
  const [cooldown, setCooldown] = useState(false);

  const sendRequest = async () => {
    if (sending || cooldown) return;
    setSending(true);
    try {
      const response = await fetch(
        `${API_URL}/tables/${tableId}/support/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: selected }),
        },
      );
      if (!response.ok) throw new Error();
      message.success("Đã gửi yêu cầu. Nhân viên sẽ tới hỗ trợ bạn.");
      setOpen(false);
      setCooldown(true);
      window.setTimeout(() => setCooldown(false), 10000);
    } catch {
      message.error("Không thể gửi yêu cầu hỗ trợ");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <FloatingButton
        onClick={() => setOpen(true)}
        disabled={cooldown}
        aria-label="Gọi nhân viên hỗ trợ"
      >
        <CustomerServiceOutlined />
        <span>{cooldown ? "Đã gửi" : "Hỗ trợ"}</span>
      </FloatingButton>
      <Modal
        title="Bạn cần hỗ trợ gì?"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={sendRequest}
        okText="Gửi yêu cầu"
        confirmLoading={sending}
        centered
      >
        <ReasonGrid>
          {reasons.map((reason) => (
            <button
              type="button"
              key={reason}
              className={selected === reason ? "active" : ""}
              onClick={() => setSelected(reason)}
            >
              {reason}
            </button>
          ))}
        </ReasonGrid>
      </Modal>
    </>
  );
};

const FloatingButton = styled.button`
  position: fixed;
  right: 20px;
  bottom: 92px;
  z-index: 28;
  height: 48px;
  padding: 0 17px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 15px;
  color: #fff;
  background: #d96b2b;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(217, 107, 43, 0.3);
  &:disabled {
    background: #9e8d83;
    cursor: default;
  }
  @media (max-width: 520px) {
    right: 12px;
    bottom: 82px;
    width: 46px;
    padding: 0;
    justify-content: center;
    span {
      display: none;
    }
  }
`;
const ReasonGrid = styled.div`
  display: grid;
  gap: 9px;
  button {
    padding: 13px;
    text-align: left;
    border: 1px solid #eadfd7;
    border-radius: 12px;
    color: #60493d;
    background: #fffaf6;
    cursor: pointer;
  }
  button.active {
    color: #b85021;
    border-color: #dc7a43;
    background: #fff0e5;
    font-weight: 800;
  }
`;
export default CustomerSupport;
