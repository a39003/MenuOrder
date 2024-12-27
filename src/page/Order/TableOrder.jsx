import React, { useEffect, useState } from "react";
import { Button, Badge, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Notificatio from "./Notificatio";
import ListDish from "./ListDish";
import {
  Tables,
  TableCar,
  TableHeader,
  Status,
  TableBody,
  TimeSection,
  DishesSection,
  TableFooter,
} from "./style";
import Bill from "../Bill/Bill";

const BASE_URL = "http://localhost:8080";

const TableOrder = ({ table, setStatus }) => {
  const [order, setOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [isBillCreated, setIsBillCreated] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  // Combined Fetch Data Function
  const fetchData = async () => {
    if (!table?.tableId) return;

    // Fetch Order Details
    try {
      const orderResponse = await fetch(`${BASE_URL}/orders/tables/${table.tableId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrder(orderData);
        updateDoneDishCount(orderData.orderItemResponseDTO);
      } else {
        console.error("Failed to fetch order details:", orderResponse.statusText);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }

    // Fetch Bill Details
    if (!order?.orderId) return;
    try {
      const billResponse = await fetch(`${BASE_URL}/orders/${order.orderId}/bill`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (billResponse.ok) {
        const billData = await billResponse.json();
        if (!billData?.message) {
          setBill(billData);
          setIsBillCreated(true);
          localStorage.setItem(`bill-${order.orderId}`, JSON.stringify(billData));
        } else {
          setBill(null);
          setIsBillCreated(false);
        }
      } else {
        console.error("Failed to fetch bill details:", billResponse.statusText);
        setBill(null);
        setIsBillCreated(false);
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  const updateDoneDishCount = (orderItems) => {
    if (orderItems && orderItems.length > 0) {
      const doneDishCount = orderItems.filter((item) => item.dishStatus === "Đã ra món").length;
      const updatedTable = { ...table, doneDish: doneDishCount };
      setStatus(updatedTable);
    }
  };

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); 

    return () => clearInterval(intervalId); 
  }, [table?.tableId]);

  const handleMakeTableEmpty = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/tables/${table?.tableId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        message.success("Làm trống bàn thành công");
        setStatus({ ...table, tableStatus: "Bàn trống" });
      } else {
        console.error("Failed to make table empty:", response.statusText);
      }
    } catch (error) {
      message.error("Error making table empty:", error);
    }
  };

  const handleCreateBill = async () => {
    if (!order?.orderId) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/orders/${order.orderId}/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Tạo bill thành công");
        setBill(data);
        setIsBillCreated(true);
        setIsBillDialogOpen(true);
        localStorage.setItem(`bill-${order.orderId}`, JSON.stringify(data));
      } else {
        message.error("Có món ăn chưa ra");
      }
    } catch (error) {
      message.error("Lỗi tạo hóa đơn:", error);
    }
  };

  const handleBillDeleted = () => {
    setIsBillCreated(false);
    localStorage.removeItem(`bill-${order?.orderId}`);
  };

  return (
    <Tables>
      <TableCar>
        <TableHeader>
          {table?.tableName} <Status>{table?.tableStatus}</Status>
        </TableHeader>
        <TableBody>
          <TimeSection>
            <ClockCircleOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            {table?.totalTime} Phút
          </TimeSection>
          <DishesSection>{`${table?.doneDish || 0}/${table?.totalDish || 0}`} món ăn</DishesSection>
        </TableBody>
        <TableFooter>
          <Badge count={table?.notificationNumber || 0}>
            <Notificatio tableId={table?.tableId} setStatus={setStatus} />
          </Badge>
          {table?.tableStatus === "Đang yêu cầu thanh toán" && (
            <div style={{ display: "flex" }}>
              <Button onClick={handleCreateBill} disabled={isBillCreated} style={{ margin: "0 5px" }}>
                Tạo bill
              </Button>
              <Bill
                bill={bill}
                tableId={table?.tableId}
                orderId={order?.orderId}
                isOpen={isBillDialogOpen}
                setIsOpen={setIsBillDialogOpen}
                setBill={setBill}
                onBillDeleted={handleBillDeleted}
              >
                Xem bill
              </Bill>
            </div>
          )}
          {table?.tableStatus === "Đã thanh toán" && (
            <Button onClick={handleMakeTableEmpty}>
              Làm trống bàn
            </Button>
          )}
          {table?.totalDish > 0 && (
            <ListDish tableId={table?.tableId} handleUpdateOrderItemStatus={handleCreateBill} />
          )}
        </TableFooter>
      </TableCar>
    </Tables>
  );
};

export default TableOrder;
