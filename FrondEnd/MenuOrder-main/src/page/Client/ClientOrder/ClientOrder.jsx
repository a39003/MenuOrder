import React,{useEffect,useMemo,useState} from "react";
import {Input,message} from "antd";
import {ArrowLeftOutlined,DeleteOutlined,FileTextOutlined,RightOutlined,ShoppingOutlined} from "@ant-design/icons";
import {useNavigate,useParams} from "react-router-dom";
import {Actions,CartIntro,CartItem,Container,Details,EmptyCart,Footer,FooterButton,HeaderButton,Headers,ItemIcon,ListContainer,Summary,Titles} from "./style";
import {API_URL} from "../../../config";

const ClientOrder=()=>{
 const [orderItems,setOrderItems]=useState([]);const [orderId,setOrderId]=useState(0);const [customerName,setCustomerName]=useState("");const [notes,setNotes]=useState({});
 const navigate=useNavigate();const {tableId}=useParams();
 useEffect(()=>{const fetchData=()=>fetch(`${API_URL}/orders/tables/${tableId}`).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{setOrderItems(data?.orderItemResponseDTO||[]);setOrderId(data?.orderId||0);setCustomerName(data?.customerName||"")}).catch(()=>{setOrderItems([]);setOrderId(0)});fetchData();const timer=setInterval(fetchData,5000);return()=>clearInterval(timer)},[tableId]);
 const totalItems=useMemo(()=>orderItems.reduce((sum,item)=>sum+Number(item.dishQuantity||0),0),[orderItems]);
 const totalPrice=useMemo(()=>orderItems.reduce((sum,item)=>sum+Number(item.customPrice||0)*Number(item.dishQuantity||0),0),[orderItems]);
 const updateQuantity=async(id,quantity)=>{if(quantity<1)return;try{const res=await fetch(`${API_URL}/orders/${orderId}/items/${id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({dishQuantity:quantity})});const data=await res.json();setOrderItems(items=>items.map(item=>item.orderItemId===data.orderItemId?data:item))}catch{message.error("KhÃ´ng thá»ƒ cáº­p nháº­t sá»‘ lÆ°á»£ng")}};
 const saveNote=(item)=>fetch(`${API_URL}/orders/${orderId}/items/${item.orderItemId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({dishNote:notes[item.orderItemId]??item.dishNote??"",dishQuantity:item.dishQuantity})}).catch(()=>message.error("KhÃ´ng thá»ƒ lÆ°u ghi chÃº"));
 const removeItem=(id)=>fetch(`${API_URL}/orders/${orderId}/items/${id}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(res=>{if(!res.ok)throw new Error();setOrderItems(items=>items.filter(item=>item.orderItemId!==id));message.success("ÄÃ£ xÃ³a mÃ³n khá»i giá»")}).catch(()=>message.error("KhÃ´ng thá»ƒ xÃ³a mÃ³n"));
 const sendOrder=()=>{const items=orderItems.map(item=>({dishId:item.dishId,quantity:item.dishQuantity,notes:notes[item.orderItemId]||item.dishNote||""}));fetch(`${API_URL}/orders/${tableId}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items})}).then(res=>{if(!res.ok)throw new Error();return res.json()}).then(data=>{if(data.orderId){message.success("ÄÃ£ gá»­i mÃ³n tá»›i nhÃ  báº¿p");navigate(`/orderitem/${tableId}`)}}).catch(()=>message.error("Gá»­i Ä‘Æ¡n chÆ°a thÃ nh cÃ´ng, vui lÃ²ng thá»­ láº¡i"))};
 return <Container>
  <Headers><HeaderButton onClick={()=>navigate(`/menu/${tableId}`)}><ArrowLeftOutlined/></HeaderButton><Titles>Giá» hÃ ng<span>{customerName || "KhÃ¡ch hÃ ng"} Â· BÃ n sá»‘ {tableId}</span></Titles><HeaderButton onClick={()=>navigate(`/orderitem/${tableId}`)}><RightOutlined/></HeaderButton></Headers>
  <CartIntro><div><h1>MÃ³n báº¡n Ä‘Ã£ chá»n</h1><p>Kiá»ƒm tra sá»‘ lÆ°á»£ng vÃ  ghi chÃº trÆ°á»›c khi gá»­i báº¿p.</p></div><span className="count">{totalItems} mÃ³n</span></CartIntro>
  <ListContainer>{orderItems.length?orderItems.map(item=><CartItem key={item.orderItemId}>
    <ItemIcon>{item.thumbnail?<img src={item.thumbnail} alt={item.dishName}/>:item.dishName?.trim()?.charAt(0)?.toUpperCase()||<ShoppingOutlined/>}</ItemIcon>
    <Details><h3>{item.dishName}</h3><span className="price">{Number(item.customPrice||0).toLocaleString("vi-VN")}Ä‘</span><div className="note"><Input prefix={<FileTextOutlined style={{color:"#b29381"}}/>} placeholder="ThÃªm ghi chÃº: Ã­t cay, khÃ´ng hÃ nh..." value={notes[item.orderItemId]??item.dishNote??""} onChange={e=>setNotes({...notes,[item.orderItemId]:e.target.value})} onBlur={()=>saveNote(item)}/></div></Details>
    <Actions className="item-actions"><div className="stepper"><button onClick={()=>updateQuantity(item.orderItemId,item.dishQuantity-1)}>âˆ’</button><strong>{item.dishQuantity}</strong><button onClick={()=>updateQuantity(item.orderItemId,item.dishQuantity+1)}>+</button></div><button className="delete" aria-label="XÃ³a mÃ³n" disabled={item.dishStatus!=="Äang chá»n"} onClick={()=>removeItem(item.orderItemId)}><DeleteOutlined/></button></Actions>
  </CartItem>):<EmptyCart><span>ðŸ½ï¸</span>Giá» hÃ ng Ä‘ang trá»‘ng. HÃ£y chá»n thÃªm mÃ³n ngon nhÃ©.</EmptyCart>}</ListContainer>
  {!!orderItems.length&&<Summary><div className="row"><span>Sá»‘ lÆ°á»£ng</span><strong>{totalItems} mÃ³n</strong></div><div className="row total"><span>Táº¡m tÃ­nh</span><strong>{totalPrice.toLocaleString("vi-VN")}Ä‘</strong></div></Summary>}
  <Footer><FooterButton onClick={()=>navigate(`/menu/${tableId}`)}>ThÃªm mÃ³n</FooterButton><FooterButton className="primary" disabled={!orderItems.length} onClick={sendOrder}>Gá»­i mÃ³n tá»›i báº¿p&nbsp; <RightOutlined/></FooterButton></Footer>
 </Container>;
};
export default ClientOrder;
