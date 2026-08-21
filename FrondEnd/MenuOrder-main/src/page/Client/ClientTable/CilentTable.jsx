import React,{useState}from"react";
import{Input,message}from"antd";
import{ArrowRightOutlined,UserOutlined}from"@ant-design/icons";
import{useNavigate,useParams}from"react-router-dom";
import hero from"../../../config/ngon.jpeg";
import promo from"../../../config/dep.jpg";
import{Cartd,ContentMain1,Contents,Footer,GuestForm,Headers,Page,Promo,Titles}from"./style";
import{API_URL}from"../../../config";

const ClientTable=()=>{const navigate=useNavigate();const{tableId}=useParams();const[customerName,setCustomerName]=useState("");
 const handleCreateOrder=async()=>{if(!customerName.trim()){message.warning("Vui lÃ²ng nháº­p tÃªn cá»§a báº¡n trÆ°á»›c khi xem thá»±c Ä‘Æ¡n");return}try{const res=await fetch(`${API_URL}/${tableId}/menus?customerName=${encodeURIComponent(customerName.trim())}`);const data=await res.json();if(!res.ok)throw new Error(data?.message);if(data?.length>0){sessionStorage.setItem(`customer-${tableId}`,customerName.trim());message.success(`ChÃ o ${customerName.trim()}, bÃ n Ä‘Ã£ sáºµn sÃ ng`);navigate(`/menu/${tableId}`)}}catch(error){message.error(error.message||"KhÃ´ng thá»ƒ táº£i thá»±c Ä‘Æ¡n. Vui lÃ²ng thá»­ láº¡i.")}};
 return <Page><Headers><Titles>TLU QuÃ¡n Â· BÃ n {tableId}</Titles></Headers><Contents>
  <ContentMain1><img src={hero} alt="KhÃ´ng gian áº©m thá»±c"/><div className="hero-copy"><span>ChÃ o má»«ng báº¡n</span><h1>Ä‚n ngon, vui trá»n khoáº£nh kháº¯c.</h1><p>Má»Ÿ cá»­a má»—i ngÃ y Â· 18:00 â€” 24:00</p></div></ContentMain1>
  <Promo><div><span className="eyebrow">Æ¯U ÄÃƒI HÃ”M NAY</span><div className="discount">Giáº£m ngay 20%</div><div className="description">DÃ nh cho khÃ¡ch Ä‘áº·t bÃ n online. HÃ£y há»i nhÃ¢n viÃªn Ä‘á»ƒ biáº¿t thÃªm chi tiáº¿t.</div></div><img src={promo} alt="Æ¯u Ä‘Ã£i táº¡i TLU QuÃ¡n"/></Promo>
  <GuestForm><div><span>ThÃ´ng tin khÃ¡ch hÃ ng</span><strong>Báº¡n tÃªn gÃ¬?</strong><small>TÃªn cá»§a báº¡n sáº½ xuáº¥t hiá»‡n trÃªn hÃ³a Ä‘Æ¡n vÃ  giÃºp nhÃ¢n viÃªn phá»¥c vá»¥ chÃ­nh xÃ¡c hÆ¡n.</small></div><Input size="large" maxLength={100} prefix={<UserOutlined/>} placeholder="Nháº­p tÃªn cá»§a báº¡n" value={customerName} onChange={event=>setCustomerName(event.target.value)} onPressEnter={handleCreateOrder}/></GuestForm>
  <Cartd onClick={handleCreateOrder}>KhÃ¡m phÃ¡ thá»±c Ä‘Æ¡n &nbsp;<ArrowRightOutlined/></Cartd>
  <Footer>Äá»‹a chá»‰: NghiÃªm XuÃ¢n YÃªm, Äáº¡i Kim, HoÃ ng Mai, HÃ  Ná»™i<br/>Hotline: 0123 456 789</Footer>
 </Contents></Page>};export default ClientTable;
