import React,{useEffect,useState} from "react";
import {Button,InputNumber,Modal,Table,message} from "antd";
import {CheckOutlined,EyeOutlined,MinusOutlined,PlusOutlined} from "@ant-design/icons";
import {AdminIconButton,OrderModalHead,OrderStatusTag,QuantityControl} from "./style";
import {API_URL} from "../../config";

const ListDish=({tableId})=>{
 const [visible,setVisible]=useState(false);const [orders,setOrders]=useState({orderItemResponseDTO:[]});
 const fetchOrders=async()=>{try{const response=await fetch(`${API_URL}/admin/orders/tables/${tableId}`,{headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}});const data=await response.json();setOrders(data||{orderItemResponseDTO:[]})}catch{if(visible)message.error("KhÃ´ng thá»ƒ táº£i chi tiáº¿t Ä‘Æ¡n")}};
 useEffect(()=>{fetchOrders();const timer=setInterval(fetchOrders,5000);return()=>clearInterval(timer)},[tableId]);
 const updateStatus=async(id)=>{const item=orders.orderItemResponseDTO.find(entry=>entry.orderItemId===id);if(!item)return;const dishStatus=item.dishStatus==="Äang ra mÃ³n"?"ÄÃ£ ra mÃ³n":"Äang ra mÃ³n";try{const response=await fetch(`${API_URL}/admin/orders/${orders.orderId}/items/${id}/status`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({dishStatus})});if(!response.ok)throw new Error();setOrders(old=>({...old,orderItemResponseDTO:old.orderItemResponseDTO.map(entry=>entry.orderItemId===id?{...entry,dishStatus}:entry)}));message.success("ÄÃ£ cáº­p nháº­t tráº¡ng thÃ¡i mÃ³n")}catch{message.error("KhÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i")}};
 const updateQuantity=async(id,quantity)=>{if(quantity<=0)return;try{const response=await fetch(`${API_URL}/admin/orders/${orders.orderId}/items/${id}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({dishQuantity:quantity})});const updated=await response.json();setOrders(old=>({...old,orderItemResponseDTO:old.orderItemResponseDTO.map(item=>item.orderItemId===updated.orderItemId?{...item,...updated}:item)}))}catch{message.error("KhÃ´ng thá»ƒ cáº­p nháº­t sá»‘ lÆ°á»£ng")}};
 const items=orders.orderItemResponseDTO||[];
 const columns=[
  {title:"MÃ³n Äƒn",dataIndex:"dishName",key:"dishName",render:(value,record)=><div style={{display:"flex",alignItems:"center",gap:12}}>{record.thumbnail?<img src={record.thumbnail} alt={value} style={{width:52,height:52,objectFit:"cover",borderRadius:12,border:"1px solid #eee1d8"}}/>:<span style={{width:52,height:52,display:"grid",placeItems:"center",borderRadius:12,background:"#fff0e5",color:"#c65b27",fontWeight:900}}>{value?.trim()?.charAt(0)?.toUpperCase()||"M"}</span>}<strong>{value}</strong></div>},
  {title:"Sá»‘ lÆ°á»£ng",key:"quantity",render:(_,record)=>{const locked=record.dishStatus==="ÄÃ£ ra mÃ³n";return <QuantityControl><Button icon={<MinusOutlined/>} disabled={locked||record.dishQuantity<=1} onClick={()=>updateQuantity(record.orderItemId,record.dishQuantity-1)}/><InputNumber controls={false} min={1} disabled={locked} value={record.dishQuantity} onChange={value=>updateQuantity(record.orderItemId,value)}/><Button icon={<PlusOutlined/>} disabled={locked} onClick={()=>updateQuantity(record.orderItemId,record.dishQuantity+1)}/></QuantityControl>}},
  {title:"GiÃ¡",dataIndex:"customPrice",key:"price",render:value=><strong style={{color:"#c65b27"}}>{Number(value||0).toLocaleString("vi-VN")}Ä‘</strong>},
  {title:"Ghi chÃº",dataIndex:"dishNote",key:"note",render:value=><span style={{color:value?"#594238":"#b5a69e"}}>{value||"KhÃ´ng cÃ³"}</span>},
  {title:"Tráº¡ng thÃ¡i",dataIndex:"dishStatus",key:"status",render:value=><OrderStatusTag $done={value==="ÄÃ£ ra mÃ³n"}>{value}</OrderStatusTag>},
  {title:"Thao tÃ¡c",key:"action",render:(_,record)=>{const preparing=record.dishStatus==="Äang ra mÃ³n";const served=record.dishStatus==="ÄÃ£ ra mÃ³n";return <Button type="primary" icon={<CheckOutlined/>} disabled={!preparing||served} onClick={()=>updateStatus(record.orderItemId)}>{served?"ÄÃ£ phá»¥c vá»¥":preparing?"XÃ¡c nháº­n ra mÃ³n":"Chá» khÃ¡ch chá»‘t"}</Button>}}
 ];
 return <>
  <AdminIconButton aria-label="Xem mÃ³n khÃ¡ch Ä‘áº·t" onClick={()=>setVisible(true)}><EyeOutlined/></AdminIconButton>
  <Modal title="Chi tiáº¿t mÃ³n khÃ¡ch Ä‘áº·t" open={visible} onCancel={()=>setVisible(false)} footer={null} width={1050}>
   <OrderModalHead><div><h3>BÃ n {tableId} Â· {orders.customerName || "KhÃ¡ch hÃ ng"}</h3><span className="sub">Theo dÃµi vÃ  cáº­p nháº­t mÃ³n theo thá»i gian thá»±c</span></div><span className="count">{items.reduce((sum,item)=>sum+Number(item.dishQuantity||0),0)} mÃ³n</span></OrderModalHead>
   <Table dataSource={items} columns={columns} pagination={false} rowKey="orderItemId" scroll={{x:820}} locale={{emptyText:"ChÆ°a cÃ³ mÃ³n nÃ o trong Ä‘Æ¡n"}}/>
   <div style={{textAlign:"right",marginTop:18}}><Button onClick={()=>setVisible(false)}>ÄÃ³ng</Button></div>
  </Modal>
 </>;
};
export default ListDish;
