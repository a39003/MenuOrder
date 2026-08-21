import React,{useEffect,useState} from "react";
import {Modal,message} from "antd";
import {BellOutlined,CustomerServiceOutlined,InboxOutlined} from "@ant-design/icons";
import {convertToTime} from "../../costormer/Time/time";
import {AdminIconButton,NotificationItem,NotificationList} from "./style";
import {API_URL} from "../../config";

const Notificatio=({tableId,setStatus})=>{
 const [open,setOpen]=useState(false);const [notifications,setNotifications]=useState([]);const [loading,setLoading]=useState(false);
 useEffect(()=>{if(!tableId||!open)return;setLoading(true);fetch(`${API_URL}/admin/notifications/tables/${tableId}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(res=>res.json()).then(data=>setNotifications(Array.isArray(data)?data:[])).catch(()=>message.error("KhÃ´ng thá»ƒ táº£i thÃ´ng bÃ¡o")).finally(()=>setLoading(false))},[open,tableId]);
 const clearAll=async()=>{try{await fetch(`${API_URL}/admin/notifications/tables/${tableId}`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}});setNotifications([]);setStatus(true);setOpen(false);message.success("ÄÃ£ xá»­ lÃ½ táº¥t cáº£ thÃ´ng bÃ¡o")}catch{message.error("KhÃ´ng thá»ƒ xá»­ lÃ½ thÃ´ng bÃ¡o")}};
 return <>
  <AdminIconButton aria-label="Xem thÃ´ng bÃ¡o" onClick={()=>setOpen(true)}><BellOutlined/></AdminIconButton>
  <Modal title={`YÃªu cáº§u tá»« bÃ n ${tableId}`} open={open} onCancel={()=>setOpen(false)} onOk={clearAll} okText="ÄÃ¡nh dáº¥u Ä‘Ã£ xá»­ lÃ½" cancelText="ÄÃ³ng" width={620} confirmLoading={loading}>
   <NotificationList>{notifications.length?notifications.map((item,index)=><NotificationItem key={item.notificationId||index}><div className="notice-icon"><CustomerServiceOutlined/></div><div><strong>{item?.text||"KhÃ¡ch cáº§n há»— trá»£"}</strong><span>YÃªu cáº§u sá»‘ {index+1}</span></div><span className="time">{convertToTime(item?.notificationTime)||"Vá»«a xong"}</span></NotificationItem>):<div style={{padding:"50px 20px",textAlign:"center",color:"#9b8173"}}><InboxOutlined style={{display:"block",fontSize:34,marginBottom:10}}/>KhÃ´ng cÃ³ yÃªu cáº§u má»›i</div>}</NotificationList>
  </Modal>
 </>;
};
export default Notificatio;
