import React,{useEffect,useRef,useState} from "react";
import {message,Modal} from "antd";
import {ArrowLeftOutlined,CustomerServiceOutlined,FileTextOutlined,ShoppingOutlined,WalletOutlined} from "@ant-design/icons";
import {useNavigate,useParams} from "react-router-dom";
import {convertToTime} from "../../../costormer/Time/time";
import {ActionButton,BackButton,ContainerModal,EmptyState,FooterButton,Headers,OrderCard,OrderHero,OrderList,Page,StatusButton,StyledTable,SupportButton,Titles} from "./style";
import {API_URL} from "../../../config";

const statusTone=(status)=>{if(status==="ÄÃ£ ra mÃ³n"||status==="HoÃ n thÃ nh")return{background:"#e7f6ed",color:"#277947"};if(status==="Äang chuáº©n bá»‹")return{background:"#fff3d8",color:"#946717"};if(status==="Äang chá»n")return{background:"#eaf1ff",color:"#3c67a5"};return{background:"#f0ebe8",color:"#75655c"}};
const ClientOrderItem=()=>{
 const [requestingSupport,setRequestingSupport]=useState({});const [orderItems,setOrderItems]=useState([]);const [orderId,setOrderId]=useState(0);const [customerName,setCustomerName]=useState("");const [bill,setBill]=useState(null);const [hasBill,setHasBill]=useState(false);const [billOpen,setBillOpen]=useState(false);
 const navigate=useNavigate();const {tableId}=useParams();
 const paymentRedirected=useRef(false);
 const orderWasLoaded=useRef(false);
 useEffect(()=>{
  const fetchData=async()=>{
   try{
    const response=await fetch(`${API_URL}/orders/tables/${tableId}`);
    if(!response.ok){
     if(orderWasLoaded.current&&!paymentRedirected.current){
      paymentRedirected.current=true;
      setBillOpen(false);
      message.success("Thanh toÃ¡n hoÃ n táº¥t. Cáº£m Æ¡n quÃ½ khÃ¡ch!");
      navigate(`/tables/${tableId}`,{replace:true});
     }
     return;
    }
    const data=await response.json();
    orderWasLoaded.current=true;
    setOrderItems(data?.orderItemResponseDTO||[]);
     setOrderId(data?.orderId||0);
     setCustomerName(data?.customerName||"");
    const billRes=await fetch(`${API_URL}/orders/${data?.orderId}/bill`);
    setHasBill(billRes.ok);
   }catch{
    // KhÃ´ng chuyá»ƒn trang khi chá»‰ máº¥t káº¿t ná»‘i máº¡ng táº¡m thá»i.
   }
  };
  fetchData();
  const timer=setInterval(fetchData,2000);
  return()=>clearInterval(timer);
 },[navigate,tableId]);
 useEffect(()=>{
  const checkPaymentStatus=async()=>{
   try{
    const response=await fetch(`${API_URL}/tables/${tableId}`);
    if(!response.ok)return;
    const table=await response.json();
    const normalizedStatus=(table?.tableStatus||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    const paymentCompleted=normalizedStatus.includes("da thanh toan")||normalizedStatus.includes("dang trong")||normalizedStatus.includes("ban trong");
    if(paymentCompleted&&!paymentRedirected.current){
     paymentRedirected.current=true;
     setBillOpen(false);
     message.success("Thanh toÃ¡n hoÃ n táº¥t. Cáº£m Æ¡n quÃ½ khÃ¡ch!");
     navigate(`/tables/${tableId}`,{replace:true});
    }
   }catch{/* Giá»¯ nguyÃªn mÃ n hÃ¬nh náº¿u mÃ¡y chá»§ táº¡m thá»i máº¥t káº¿t ná»‘i. */}
  };
  checkPaymentStatus();
  const timer=setInterval(checkPaymentStatus,2000);
  return()=>clearInterval(timer);
 },[navigate,tableId]);
 const requestSupport=async(id)=>{setRequestingSupport(old=>({...old,[id]:true}));try{const res=await fetch(`${API_URL}/orders/${orderId}/items/${id}/request`,{method:"POST",headers:{"Content-Type":"application/json"}});if(!res.ok)throw new Error();message.success("ÄÃ£ gá»i nhÃ¢n viÃªn há»— trá»£")}catch{message.error("KhÃ´ng thá»ƒ gá»­i yÃªu cáº§u há»— trá»£")}finally{setRequestingSupport(old=>({...old,[id]:false}))}};
 const requestPayment=async()=>{try{const res=await fetch(`${API_URL}/tables/${tableId}/payment/request`,{method:"POST",headers:{"Content-Type":"application/json"}});if(!res.ok)throw new Error();message.success("ÄÃ£ gá»­i yÃªu cáº§u thanh toÃ¡n")}catch{message.error("KhÃ´ng thá»ƒ gá»­i yÃªu cáº§u thanh toÃ¡n")}};
 const getBill=()=>fetch(`${API_URL}/orders/${orderId}/bill`,{headers:{"Content-Type":"application/json"}}).then(res=>{if(!res.ok)throw new Error();return res.json()}).then(data=>{setBill(data);setBillOpen(true)}).catch(()=>message.error("HÃ³a Ä‘Æ¡n chÆ°a sáºµn sÃ ng"));
 const allSelecting=orderItems.length>0&&orderItems.every(item=>item.dishStatus==="Äang chá»n");
 return <Page>
  <Headers><BackButton onClick={()=>navigate(`/order/${tableId}`)}><ArrowLeftOutlined/></BackButton><Titles>ÄÆ¡n hÃ ng<span>{customerName || "KhÃ¡ch hÃ ng"} Â· BÃ n sá»‘ {tableId}</span></Titles><div/></Headers>
  <OrderHero><div><h1>Báº¿p Ä‘ang chuáº©n bá»‹</h1><p>Tráº¡ng thÃ¡i mÃ³n Ä‘Æ°á»£c cáº­p nháº­t tá»± Ä‘á»™ng má»—i 5 giÃ¢y.</p></div><div className="hero-icon"><ShoppingOutlined/></div></OrderHero>
  <OrderList>{orderItems.length?orderItems.map(item=><OrderCard key={item.orderItemId}>
   <div><h3>{item.dishName}</h3><div className="meta"><span className="quantity">Ã— {item.dishQuantity}</span><strong>{Number(item.customPrice||0).toLocaleString("vi-VN")}Ä‘</strong>{item.dishNote&&<span>Â· {item.dishNote}</span>}</div></div>
   <div className="card-side"><StatusButton $tone={statusTone(item.dishStatus)}>{item.dishStatus}</StatusButton><SupportButton disabled={requestingSupport[item.orderItemId]} onClick={()=>requestSupport(item.orderItemId)}><CustomerServiceOutlined/> {requestingSupport[item.orderItemId]?"Äang gá»i...":"Há»— trá»£"}</SupportButton></div>
  </OrderCard>):<EmptyState><span>ðŸ§¾</span>ChÆ°a cÃ³ mÃ³n nÃ o trong Ä‘Æ¡n hÃ ng.</EmptyState>}</OrderList>
  <FooterButton><ActionButton onClick={()=>navigate(`/menu/${tableId}`)}>ThÃªm mÃ³n</ActionButton><ActionButton className="primary" disabled={!orderItems.length||allSelecting} onClick={requestPayment}><WalletOutlined/> Thanh toÃ¡n</ActionButton><ActionButton className="bill-button" disabled={!orderItems.length||allSelecting||!hasBill} onClick={getBill}><FileTextOutlined/> HÃ³a Ä‘Æ¡n</ActionButton></FooterButton>
  <Modal title="Chi tiáº¿t hÃ³a Ä‘Æ¡n" open={billOpen} onCancel={()=>setBillOpen(false)} footer={null} centered width={720}><ContainerModal>
   <div className="receipt-head"><h2>TLU QUÃN</h2><p>KhÃ¡ch hÃ ng: <strong>{bill?.customerName || customerName || "KhÃ¡ch hÃ ng"}</strong> Â· BÃ n: <strong>{bill?.tableName || tableId}</strong><br/>NghiÃªm XuÃ¢n YÃªm, Äáº¡i Kim, HoÃ ng Mai, HÃ  Ná»™i Â· Hotline: 0123 456 789</p></div>
   <StyledTable dataSource={bill?.billItemResponseDTOS||[]} columns={[{title:"TÃªn mÃ³n",dataIndex:"billItemName",key:"name"},{title:"SL",dataIndex:"billItemQuantity",key:"quantity"},{title:"ÄÆ¡n giÃ¡",dataIndex:"billItemPrice",key:"price",render:value=>Number(value||0).toLocaleString("vi-VN")},{title:"ThÃ nh tiá»n",key:"total",render:(_,record)=>(record.billItemQuantity*record.billItemPrice).toLocaleString("vi-VN")}]} pagination={false} rowKey="billItemId"/>
   <div className="receipt-total"><span>Tá»•ng thanh toÃ¡n</span><strong>{Number(bill?.totalAmount||0).toLocaleString("vi-VN")}Ä‘</strong></div><div className="receipt-time">Thá»i gian: {convertToTime(bill?.billDateTime)}</div>
  </ContainerModal></Modal>
 </Page>;
};
export default ClientOrderItem;
