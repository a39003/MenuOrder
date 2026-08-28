import Account from "../page/Account/Account";
import ClientDish from "../page/Client/ClientDish/ClienDish";
import ClientOrder from "../page/Client/ClientOrder/ClientOrder";
import ClientOrderItem from "../page/Client/ClientOrderItem/ClientOrderItem";
import ClientTable from "../page/Client/ClientTable/CilentTable";
import Dish from "../page/Dish/Dish";
import Login from "../page/Login/Login";
import Menu from "../page/Menu/Menu";
import Order from "../page/Order/Order";
import Table from "../page/Table/Table";
import Dashboard from "../page/Dashboard/Dashboard";
import PaidBills from "../page/PaidBills/PaidBills";
import FloorPlan from "../page/FloorPlan/FloorPlan";
import Kitchen from "../page/Kitchen/Kitchen";

export const routes = [
  { path: "/admin/floor-plan", page: FloorPlan, isShowHeader: true, protected: true, roles: ["ADMIN", "NHAN_VIEN", "THU_NGAN"] },
  { path: "/admin/dashboard", page: Dashboard, isShowHeader: true, protected: true, roles: ["ADMIN"] },
  { path: "/admin/kitchen", page: Kitchen, isShowHeader: true, protected: true, roles: ["ADMIN", "BEP"] },
  {
    path: "/login",
    page: Login,
    isShowHeader: false,
  },
  {
    path: "/admin/table",
    page: Table,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN", "NHAN_VIEN", "THU_NGAN"],
  },
  {
    path: "/admin/order",
    page: Order,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN", "NHAN_VIEN", "THU_NGAN", "BEP"],
  },
  {
    path: "/admin/dish",
    page: Dish,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN", "BEP"],
  },
  {
    path: "/admin/menu",
    page: Menu,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN"],
  },
  {
    path: "/account",
    page: Account,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN"],
  },
  {
    path: "/admin/bill",
    page: PaidBills,
    isShowHeader: true,
    protected: true,
    roles: ["ADMIN", "THU_NGAN"],
  },
  { path: "/admin/bills", page: PaidBills, isShowHeader: true, protected: true, roles: ["ADMIN", "THU_NGAN"] },
  {
    path: "/tables/:tableId",
    page: ClientTable,
  },
  {
    path: "/menu/:tableId",
    page: ClientDish,
  },
  {
    path: "/order/:tableId",
    page: ClientOrder,
  },
  {
    path: "/orderitem/:tableId",
    page: ClientOrderItem,
  },
];
