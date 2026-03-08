import React, { useEffect, useState } from "react"
import { Tables, TableCar, TableHeader, Status, TableBody,TimeSection,
    DishesSection, TableFooter, Notification, StatusFooter, Icons, 
    Conter} from "./style";
import { ClockCircleOutlined, EyeOutlined, BellOutlined, EllipsisOutlined, CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons"
import Modald from "../../costormer/Components/Modal/Modal";
import { Badge, Button, Form, Input, InputNumber, Table } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import Foor from "../../costormer/Components/Foor/Foor";
import StatusPanel from "./StatusPanl";
import TableOrder from "./TableOrder";


const Order = () => {

  const tables = [
    {
      id: 1,
      status: "Đã thanh toán",
      time: "56'",
      dishes: "Món 15/15",
      additionalStatus: "Bàn trống",
    },
    {
      id: 2,
      status: "Bàn đang order",
      time: "2'",
      dishes: "Món 0/0",
      additionalStatus: "Bàn trống",
    },
    {
      id: 3,
      status: "Bàn đang order",
      time: "3'",
      dishes: "Món 0/0",
    },
    {
      id: 4,
      status: "Đang phục vụ",
      time: "10'",
      dishes: "Món 5/14",
    },
    {
        id: 5,
        status: "Đang phục vụ",
        time: "10'",
        dishes: "Món 5/14",
      },
      {
        id: 6,
        status: "Đang phục vụ",
        time: "10'",
        dishes: "Món 5/14",
      },
  ];

    
 


  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      dish: "Bò sốt tiêu đen",
      quantity: 1,
      price: 239000,
      status: "done",
      note:"",
    },
    {
      key: "2",
      dish: "Dê tái chanh",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay, không cho hành",
    },
    {
      key: "3",
      dish: "Bò xào rau muống",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay",
    },
    {
      key: "4",
      dish: "Dê hấp",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay",
    },
    {
      key: "5",
      dish: "Thịt lợn quay",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay",
    },
    {
      key: "6",
      dish: "Chân giò hầm",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay",
    },
    {
      key: "7",
      dish: "Bò sốt tiêu đen (Trẻ em)",
      quantity: 1,
      price: 139000,
      status: "done",
      note:"bỏ bớt cay",
    },
  ]);



    return(
      <div  style={{backgroundColor: "#f3e2d3", height: "200vh"}}>
        <Conter style={{padding:'20px'}}>
          <StatusPanel tables={tables}/>
        </Conter>
        <Foor/>
        </div>
    )
}

export default Order