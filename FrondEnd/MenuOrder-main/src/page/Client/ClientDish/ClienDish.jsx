import React, { useEffect, useMemo, useState } from "react";
import { Badge, Input } from "antd";
import { ArrowLeftOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  Cart, Categories, CategoryButton, DishGrid, EmptyState, HeaderInner,
  Headers, Hero, IconButton, Page, SearchBox, SectionHead, Shell, Titles,
} from "./style";
import DishComponent from "./DishComponent";
import { API_URL } from "../../../config";

const ClientDish = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [menus, setMenus] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [menuId, setMenuId] = useState("0");
  const [orderId, setOrderId] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState(sessionStorage.getItem(`customer-${tableId}`) || "");

  useEffect(() => {
    fetch(`${API_URL}/menus`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMenus(data);
          setAllDishes(data.flatMap((menu) => menu.dishResponseDTO || []));
        }
      })
      .catch((error) => console.error("Error fetching menus:", error));
  }, []);

  useEffect(() => {
    if (!tableId) return;
    fetch(`${API_URL}/orders/tables/${tableId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrderId(data?.orderId || 0);
        setCustomerName(data?.customerName || "");
        setCartCount((data?.orderItemResponseDTO || []).reduce((sum, item) => sum + item.dishQuantity, 0));
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, [tableId]);

  const dishes = useMemo(() => {
    const source = menuId === "0"
      ? allDishes
      : menus.find((menu) => String(menu.menuId) === menuId)?.dishResponseDTO || [];
    const keyword = search.trim().toLocaleLowerCase("vi");
    return keyword ? source.filter((dish) => dish.dishName?.toLocaleLowerCase("vi").includes(keyword)) : source;
  }, [allDishes, menuId, menus, search]);

  return (
    <Page>
      <Headers>
        <HeaderInner>
          <IconButton aria-label="Quay láº¡i" onClick={() => navigate(`/tables/${tableId}`)}><ArrowLeftOutlined /></IconButton>
          <Titles>TLU QuÃ¡n<span>{customerName || "KhÃ¡ch hÃ ng"} Â· BÃ n sá»‘ {tableId}</span></Titles>
          <div />
        </HeaderInner>
      </Headers>

      <Shell>
        <Hero>
          <p>HÃ´m nay Äƒn gÃ¬?</p>
          <h1>MÃ³n ngon vá»«a náº¥u, chá»n nhanh táº¡i bÃ n.</h1>
          <small>KhÃ¡m phÃ¡ thá»±c Ä‘Æ¡n vÃ  thÃªm mÃ³n báº¡n yÃªu thÃ­ch vÃ o giá».</small>
        </Hero>

        <SearchBox>
          <Input prefix={<SearchOutlined style={{ color: "#b08b74", marginRight: 8 }} />} value={search} onChange={(event) => setSearch(event.target.value)} allowClear placeholder="TÃ¬m mÃ³n báº¡n muá»‘n..." />
        </SearchBox>

        <Categories aria-label="Danh má»¥c mÃ³n Äƒn">
          <CategoryButton $active={menuId === "0"} onClick={() => setMenuId("0")}>Táº¥t cáº£</CategoryButton>
          {menus.map((menu) => (
            <CategoryButton key={menu.menuId} $active={menuId === String(menu.menuId)} onClick={() => setMenuId(String(menu.menuId))}>
              {menu.menuTitle}
            </CategoryButton>
          ))}
        </Categories>

        <SectionHead><h2>Thá»±c Ä‘Æ¡n</h2><span>{dishes.length} mÃ³n</span></SectionHead>
        <DishGrid>
          {dishes.map((dish) => <DishComponent key={dish.dishId} dish={dish} orderId={orderId} handleAddToCart={(quantity) => setCartCount((count) => count + quantity)} />)}
          {!dishes.length && <EmptyState>KhÃ´ng tÃ¬m tháº¥y mÃ³n phÃ¹ há»£p. HÃ£y thá»­ má»™t tá»« khÃ³a khÃ¡c nhÃ©.</EmptyState>}
        </DishGrid>
      </Shell>

      <Cart onClick={() => navigate(`/order/${tableId}`)}>
        <Badge count={cartCount} overflowCount={99}><ShoppingCartOutlined style={{ color: "#fff", fontSize: 21 }} /></Badge>
      </Cart>
    </Page>
  );
};

export default ClientDish;
