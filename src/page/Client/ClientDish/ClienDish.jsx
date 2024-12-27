import React, { useEffect, useState } from "react";
import { Badge, Button, Tabs } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Cart, Headers, Titles } from "./style";
import DishComponent from "./DishComponent";

const { TabPane } = Tabs;

const ClienDish = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [menus, setMenus] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [menuId, setMenuId] = useState(0);
  const [orderId, setOrderId] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/menus")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setMenus(data);
          setAllDishes(data.flatMap(menu => menu.dishResponseDTO)); 
          setDishes(data.flatMap(menu => menu.dishResponseDTO)); 
          setMenuId(data[0]?.menuId || 0);
        }
      })
      .catch((error) => console.error("Error fetching menus:", error));
  }, []);

  useEffect(() => {
    if (tableId) {
      fetch(`http://localhost:8080/orders/tables/${tableId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setOrderId(data.orderId || 0);
            const totalItems = data.orderItemResponseDTO?.reduce(
              (sum, item) => sum + item.dishQuantity,
              0
            ) || 0;
            setCartCount(totalItems); 
          }
        })
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [tableId]);

  const handleMenuChange = (key) => {
    setMenuId(Number(key));
    if (key === "0") {
      setDishes(allDishes);
    } else {
      const selectedMenu = menus.find((menu) => menu.menuId.toString() === key);
      if (selectedMenu) {
        setDishes(selectedMenu.dishResponseDTO || []); 
      }
    }
  };

  const handleAddToCart = (quantity) => {
    setCartCount((prevCount) => prevCount + quantity); 
  };

  return (
    <div
      style={{
        padding: "10px",
        background: "#f5f5f5",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <Headers>
        <ArrowLeftOutlined
          style={{ fontSize: "20px", cursor: "pointer", position:"absolute", left:"10px" }}
          onClick={() => navigate(`/tables/${tableId}`)}
        />
        <Titles level={4} style={{margin:"0"}}>DANH SÁCH MÓN ĂN</Titles>
      </Headers>

      <div
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch", 
        msOverflowStyle: "none", 
        scrollbarWidth: "none", 
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <Tabs
        defaultActiveKey={menuId?.toString()}
        centered
        tabBarStyle={{
          background: "#fff",
          borderRadius: "5px",
          marginBottom: "10px",
          padding: "0",
        }}
        onChange={handleMenuChange}
        style={{
          flexShrink: 0,
          minWidth: "100%", // Đảm bảo Tabs chiếm đủ chiều rộng
        }}
        tabPosition="top"
      >
        <TabPane key="0" tab="All" />
        {menus.map((menu) => (
          <TabPane key={menu.menuId} tab={menu.menuTitle}></TabPane>
        ))}
      </Tabs>
    </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {dishes.map((dish) => (
          <DishComponent
            dish={dish}
            orderId={orderId}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <Cart onClick={() => navigate(`/order/${tableId}`)}>
        <Badge
          count={cartCount}
          style={{ backgroundColor: "red" }}
        >
          <ShoppingCartOutlined style={{ fontSize: "18px", color: "black" }} />
        </Badge>
      </Cart>
    </div>
  );
};

export default ClienDish;
