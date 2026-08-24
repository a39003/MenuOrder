import React, { useEffect, useMemo, useState } from "react";
import { Badge, Input } from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  Cart,
  Categories,
  CategoryButton,
  DishGrid,
  EmptyState,
  HeaderInner,
  Headers,
  Hero,
  IconButton,
  Page,
  SearchBox,
  SectionHead,
  Shell,
  Titles,
} from "./style";
import DishComponent from "./DishComponent";
import { API_URL } from "../../../config";
import CustomerSupport from "../CustomerSupport/CustomerSupport";

const ClientDish = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const [menus, setMenus] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [menuId, setMenuId] = useState("0");
  const [orderId, setOrderId] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState(
    sessionStorage.getItem(`customer-${tableId}`) || "",
  );
  const [tableName, setTableName] = useState(
    sessionStorage.getItem(`table-name-${tableId}`) || "",
  );

  useEffect(() => {
    fetch(`${API_URL}/tables/${tableId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.tableName) return;
        setTableName(data.tableName);
        sessionStorage.setItem(`table-name-${tableId}`, data.tableName);
      })
      .catch(() => {});
  }, [tableId]);

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
        setCartCount(
          (data?.orderItemResponseDTO || []).reduce(
            (sum, item) => sum + item.dishQuantity,
            0,
          ),
        );
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, [tableId]);

  const dishes = useMemo(() => {
    const source =
      menuId === "0"
        ? allDishes
        : menus.find((menu) => String(menu.menuId) === menuId)
            ?.dishResponseDTO || [];
    const keyword = search.trim().toLocaleLowerCase("vi");
    return keyword
      ? source.filter((dish) =>
          dish.dishName?.toLocaleLowerCase("vi").includes(keyword),
        )
      : source;
  }, [allDishes, menuId, menus, search]);

  return (
    <Page>
      <Headers>
        <HeaderInner>
          <IconButton
            aria-label="Quay lại"
            onClick={() => navigate(`/tables/${tableId}`)}
          >
            <ArrowLeftOutlined />
          </IconButton>
          <Titles>
            TLU Quán
            <span>
              {customerName || "Khách hàng"} ·{" "}
              {tableName || "Đang tải tên bàn..."}
            </span>
          </Titles>
          <div />
        </HeaderInner>
      </Headers>

      <Shell>
        <Hero>
          <p>Hôm nay ăn gì?</p>
          <h1>Món ngon vừa nấu, chọn nhanh tại bàn.</h1>
          <small>Khám phá thực đơn và thêm món bạn yêu thích vào giỏ.</small>
        </Hero>

        <SearchBox>
          <Input
            prefix={
              <SearchOutlined style={{ color: "#b08b74", marginRight: 8 }} />
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            placeholder="Tìm món bạn muốn..."
          />
        </SearchBox>

        <Categories aria-label="Danh mục món ăn">
          <CategoryButton
            $active={menuId === "0"}
            onClick={() => setMenuId("0")}
          >
            Tất cả
          </CategoryButton>
          {menus.map((menu) => (
            <CategoryButton
              key={menu.menuId}
              $active={menuId === String(menu.menuId)}
              onClick={() => setMenuId(String(menu.menuId))}
            >
              {menu.menuTitle}
            </CategoryButton>
          ))}
        </Categories>

        <SectionHead>
          <h2>Thực đơn</h2>
          <span>{dishes.length} món</span>
        </SectionHead>
        <DishGrid>
          {dishes.map((dish) => (
            <DishComponent
              key={dish.dishId}
              dish={dish}
              orderId={orderId}
              handleAddToCart={(quantity) =>
                setCartCount((count) => count + quantity)
              }
            />
          ))}
          {!dishes.length && (
            <EmptyState>
              Không tìm thấy món phù hợp. Hãy thử một từ khóa khác nhé.
            </EmptyState>
          )}
        </DishGrid>
      </Shell>

      <Cart onClick={() => navigate(`/order/${tableId}`)}>
        <Badge count={cartCount} overflowCount={99}>
          <ShoppingCartOutlined style={{ color: "#fff", fontSize: 21 }} />
        </Badge>
      </Cart>
      <CustomerSupport tableId={tableId} />
    </Page>
  );
};

export default ClientDish;
