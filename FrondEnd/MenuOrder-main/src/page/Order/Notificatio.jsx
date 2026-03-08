import React, { useEffect, useState } from "react";
import Modald from "../../costormer/Components/Modal/Modal";
import { Badge, Button, Form } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { convertToTime } from "../../costormer/Time/time";

const Notificatio = ({ children, tableId, setStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotionfications] = useState([]);


  useEffect(() => {
    if (!tableId || !isModalOpen) return; 
    
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Notifications data:", data); 
        setNotionfications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [isModalOpen, tableId]); 

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeteleAll = async () => {
    try {
      await fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotionfications([]);
      setIsModalOpen(false);
      setStatus(true);
    } catch (err) {
      console.error("Failed to delete notifications:", err);
    }
  };

  return (
    <div>
      <BellOutlined onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer" }} />
      <Modald
        title="Thông báo"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleDeteleAll}
        okText="Xác Nhận"
        cancelText="Hủy"
        width={700}
      >
        <Form name="basic" autoComplete="off">
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr>
                <th style={{ padding: "10px 20px", textAlign: "left", borderBottom: "2px solid #ddd", backgroundColor: "#f4f4f4",fontWeight: "bold",}}>STT</th>
                <th style={{ padding: "10px 20px", textAlign: "left", borderBottom: "2px solid #ddd", backgroundColor: "#f4f4f4",fontWeight: "bold",}}>Yêu cầu</th>
                <th style={{ padding: "10px 20px", textAlign: "left", borderBottom: "2px solid #ddd", backgroundColor: "#f4f4f4",fontWeight: "bold",}}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {notifications && notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <tr key={index}>
                    <td style={{  padding: "10px 20px",
                      borderBottom: "1px solid #ddd",}}>{index + 1}</td>
                    <td style={{  padding: "10px 20px",
                      borderBottom: "1px solid #ddd",}}>{notification?.text || "Không có nội dung"}</td>
                    <td style={{  padding: "10px 20px",
                      borderBottom: "1px solid #ddd",}}>{convertToTime(notification?.notificationTime) || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Không có thông báo</td>
                </tr>
              )}
            </tbody>
          </table>
        </Form>
      </Modald>
    </div>
  );
};

export default Notificatio;
