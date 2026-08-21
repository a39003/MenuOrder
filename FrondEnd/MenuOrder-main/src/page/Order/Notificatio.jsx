import React,{useEffect,useState} from "react";
import {Modal,message} from "antd";
import {BellOutlined,CustomerServiceOutlined,InboxOutlined} from "@ant-design/icons";
import {convertToTime} from "../../costormer/Time/time";
import {AdminIconButton,NotificationItem,NotificationList} from "./style";

const Notificatio=({tableId,setStatus})=>{
 const [open,setOpen]=useState(false);const [notifications,setNotifications]=useState([]);const [loading,setLoading]=useState(false);
 useEffect(()=>{if(!tableId||!open)return;setLoading(true);fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(res=>res.json()).then(data=>setNotifications(Array.isArray(data)?data:[])).catch(()=>message.error("Không thể tải thông báo")).finally(()=>setLoading(false))},[open,tableId]);
 const clearAll=async()=>{try{await fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}});setNotifications([]);setStatus(true);setOpen(false);message.success("Đã xử lý tất cả thông báo")}catch{message.error("Không thể xử lý thông báo")}};
 return <>
  <AdminIconButton aria-label="Xem thông báo" onClick={()=>setOpen(true)}><BellOutlined/></AdminIconButton>
  <Modal title={`Yêu cầu từ bàn ${tableId}`} open={open} onCancel={()=>setOpen(false)} onOk={clearAll} okText="Đánh dấu đã xử lý" cancelText="Đóng" width={620} confirmLoading={loading}>
   <NotificationList>{notifications.length?notifications.map((item,index)=><NotificationItem key={item.notificationId||index}><div className="notice-icon"><CustomerServiceOutlined/></div><div><strong>{item?.text||"Khách cần hỗ trợ"}</strong><span>Yêu cầu số {index+1}</span></div><span className="time">{convertToTime(item?.notificationTime)||"Vừa xong"}</span></NotificationItem>):<div style={{padding:"50px 20px",textAlign:"center",color:"#9b8173"}}><InboxOutlined style={{display:"block",fontSize:34,marginBottom:10}}/>Không có yêu cầu mới</div>}</NotificationList>
  </Modal>
 </>;
};
export default Notificatio;
