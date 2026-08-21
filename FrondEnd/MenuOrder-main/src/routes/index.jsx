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

export const routes = [
    { path:'/admin/dashboard', page: Dashboard, isShowHeader: true },
    {
        path:'/login',
        page: Login,
        isShowHeader: false
    },
    {
        path:'/admin/table',
        page: Table,
        isShowHeader: true
    },
    {
        path:'/admin/order',
        page: Order,
        isShowHeader: true
    },
    {
        path:'/admin/dish',
        page: Dish,
        isShowHeader: true
    },
    {
        path:'/admin/menu',
        page: Menu,
        isShowHeader: true
    },
    {
        path:'/account',
        page: Account,
        isShowHeader: true
    },
    {
        path:'/admin/bill',
        page: PaidBills,
        isShowHeader: true
    },
    { path:'/admin/bills', page: PaidBills, isShowHeader: true },
    {
        path:'/tables/:tableId',
        page: ClientTable,

    },
    {
        path:'/menu/:tableId',
        page: ClientDish,

    },
    {
        path:'/order/:tableId',
        page: ClientOrder,

    },
    {
        path:'/orderitem/:tableId',
        page: ClientOrderItem,

    },



]
