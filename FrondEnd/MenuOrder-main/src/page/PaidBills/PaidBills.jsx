import React,{useEffect,useMemo,useState}from"react";
import{Button,Empty,Modal,Spin,Table,message}from"antd";
import{EyeOutlined,SearchOutlined}from"@ant-design/icons";
import{Card,Filters,Head,Page,Receipt,Summary}from"./style";
import{API_URL}from"../../config";

const money=value=>`${Number(value||0).toLocaleString("vi-VN")} Ä‘`;
const formatDate=value=>value?new Date(value).toLocaleString("vi-VN"):"â€”";
const today=new Date().toISOString().slice(0,10);
const firstDay=()=>{const date=new Date();date.setDate(1);return date.toISOString().slice(0,10)};

const PaidBills=()=>{
 const[bills,setBills]=useState([]);const[loading,setLoading]=useState(true);const[selected,setSelected]=useState(null);
 const[filters,setFilters]=useState({from:firstDay(),to:today,search:""});const[query,setQuery]=useState(filters);
 useEffect(()=>{setLoading(true);const params=new URLSearchParams();Object.entries(query).forEach(([key,value])=>value&&params.set(key,value));fetch(`${API_URL}/admin/bills?${params}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then(async response=>{if(!response.ok)throw new Error((await response.json()).message||"KhÃ´ng táº£i Ä‘Æ°á»£c hÃ³a Ä‘Æ¡n");return response.json()}).then(setBills).catch(error=>message.error(error.message)).finally(()=>setLoading(false))},[query]);
 const total=useMemo(()=>bills.reduce((sum,bill)=>sum+Number(bill.totalAmount||0),0),[bills]);
 const columns=[
  {title:"MÃ£ bill",dataIndex:"billId",render:value=><span className="bill-id">#{value}</span>},
  {title:"KhÃ¡ch hÃ ng",dataIndex:"customerName",render:value=><span className="table-name">{value||"KhÃ¡ch hÃ ng"}</span>},
  {title:"BÃ n",dataIndex:"tableName"},{title:"MÃ£ Ä‘Æ¡n",dataIndex:"orderId",render:value=>`#${value}`},
  {title:"Thá»i gian",dataIndex:"paidAt",render:value=><span className="date">{formatDate(value)}</span>},
  {title:"Sá»‘ mÃ³n",dataIndex:"totalItems",align:"center"},{title:"Tá»•ng tiá»n",dataIndex:"totalAmount",align:"right",render:value=><span className="amount">{money(value)}</span>},
  {title:"",key:"action",align:"center",render:(_,record)=><Button type="text" icon={<EyeOutlined/>} onClick={()=>setSelected(record)}>Chi tiáº¿t</Button>}
 ];
 return <Page><Head><div><span className="eyebrow">TÃ i chÃ­nh</span><h1>Lá»‹ch sá»­ thanh toÃ¡n</h1><p>Tra cá»©u hÃ³a Ä‘Æ¡n theo tÃªn khÃ¡ch hÃ ng, bÃ n hoáº·c mÃ£ Ä‘Æ¡n.</p></div><Summary><span>Doanh thu trong bá»™ lá»c</span><strong>{money(total)}</strong><span>{bills.length} hÃ³a Ä‘Æ¡n</span></Summary></Head>
  <Filters><input type="search" placeholder="TÃ¬m tÃªn khÃ¡ch, mÃ£ bill, mÃ£ Ä‘Æ¡n hoáº·c tÃªn bÃ n" value={filters.search} onChange={event=>setFilters({...filters,search:event.target.value})}/><input aria-label="Tá»« ngÃ y" type="date" value={filters.from} onChange={event=>setFilters({...filters,from:event.target.value})}/><input aria-label="Äáº¿n ngÃ y" type="date" value={filters.to} onChange={event=>setFilters({...filters,to:event.target.value})}/><button onClick={()=>setQuery({...filters})}><SearchOutlined/> TÃ¬m kiáº¿m</button></Filters>
  <Card><div className="table-wrap">{loading?<div style={{display:"grid",placeItems:"center",height:300}}><Spin size="large"/></div>:bills.length?<Table rowKey="billId" columns={columns} dataSource={bills} pagination={{pageSize:8,showSizeChanger:false}} scroll={{x:900}}/>:<Empty style={{padding:70}} description="KhÃ´ng cÃ³ hÃ³a Ä‘Æ¡n trong thá»i gian nÃ y"/>}</div></Card>
  <Modal open={Boolean(selected)} onCancel={()=>setSelected(null)} footer={null} width={620} centered title={null}>{selected&&<Receipt><div className="receipt-head"><h2>TLU QuÃ¡n Â· HÃ³a Ä‘Æ¡n #{selected.billId}</h2><p>KhÃ¡ch hÃ ng: <strong>{selected.customerName||"KhÃ¡ch hÃ ng"}</strong> Â· BÃ n: <strong>{selected.tableName}</strong></p></div><div className="meta"><div><span>KhÃ¡ch hÃ ng</span><strong>{selected.customerName||"KhÃ¡ch hÃ ng"}</strong></div><div><span>BÃ n Â· MÃ£ Ä‘Æ¡n</span><strong>{selected.tableName} Â· #{selected.orderId}</strong></div><div><span>Thá»i gian</span><strong>{formatDate(selected.paidAt)}</strong></div></div>{selected.items?.map((item,index)=><div className="line" key={`${item.billItemName}-${index}`}><div><strong>{item.billItemName}</strong><small>{item.billItemQuantity} Ã— {money(item.billItemPrice)}</small></div><strong>{money(item.billItemQuantity*item.billItemPrice)}</strong></div>)}<div className="total"><span>Tá»•ng thanh toÃ¡n</span><strong>{money(selected.totalAmount)}</strong></div></Receipt>}</Modal>
 </Page>;
};
export default PaidBills;
