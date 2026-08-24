import React, { useEffect, useState } from "react";
import { Button, Badge, message } from "antd";
import { ClockCircleOutlined, CrownFilled } from "@ant-design/icons";
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
import { API_URL } from "../../config";

const BASE_URL = API_URL;

const TableOrder = ({ table, onTableChanged }) => {
  const [order, setOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [isBillCreated, setIsBillCreated] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [creatingBill, setCreatingBill] = useState(false);
  const [emptyingTable, setEmptyingTable] = useState(false);

  // Combined Fetch Data Function
  const fetchData = async () => {
    if (!table?.tableId) return;
    let currentOrderId = order?.orderId;

    // Fetch Order Details
    try {
      const orderResponse = await fetch(
        `${BASE_URL}/orders/tables/${table.tableId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        currentOrderId = orderData?.orderId;
        setOrder(orderData);
      } else {
        console.error(
          "Failed to fetch order details:",
          orderResponse.statusText,
        );
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }

    // Fetch Bill Details
    const shouldFetchBill = [
      "Đang yêu cầu thanh toán",
      "Đã thanh toán",
    ].includes(table?.tableStatus);

    if (!currentOrderId || !shouldFetchBill) return;
    try {
      const billResponse = await fetch(
        `${BASE_URL}/orders/${currentOrderId}/bill`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (billResponse.ok) {
        const billData = await billResponse.json();
        if (!billData?.message) {
          setBill(billData);
          setIsBillCreated(true);
          localStorage.setItem(
            `bill-${currentOrderId}`,
            JSON.stringify(billData),
          );
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

  useEffect(() => {
    if (table?.tableStatus === "Đang trống") {
      setOrder(null);
      setBill(null);
      setIsBillCreated(false);
      return undefined;
    }

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [table?.tableId, table?.tableStatus]);

  const handleMakeTableEmpty = async () => {
    if (emptyingTable) return;
    setEmptyingTable(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/tables/${table?.tableId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        message.success("Làm trống bàn thành công");
        onTableChanged?.();
      } else {
        console.error("Failed to make table empty:", response.statusText);
      }
    } catch (error) {
      message.error("Error making table empty:", error);
    } finally {
      setEmptyingTable(false);
    }
  };

  const handleCreateBill = async () => {
    if (!order?.orderId) return;
    if (creatingBill) return;
    setCreatingBill(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/orders/${order.orderId}/bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

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
    } finally {
      setCreatingBill(false);
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
          <span>
            {table?.tableName}
            <small
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: "#a98f81",
                marginTop: 3,
              }}
            >
              Khách: {order?.customerName || "Chưa nhập tên"}
            </small>
            <small className="table-detail">
              {table?.tableType === "VIP" && <CrownFilled />}
              <strong>{table?.tableType || "THƯỜNG"}</strong>
            </small>
          </span>{" "}
          <Status>{table?.tableStatus}</Status>
        </TableHeader>
        <TableBody>
          <TimeSection>
            <ClockCircleOutlined
              style={{ fontSize: "18px", marginRight: "8px" }}
            />
            {table?.totalTime} Phút
          </TimeSection>
          <DishesSection>
            {`${table?.doneDish || 0}/${table?.totalDish || 0}`} món ăn
          </DishesSection>
        </TableBody>
        <TableFooter>
          <Badge count={table?.notificationNumber || 0}>
            <Notificatio tableId={table?.tableId} setStatus={onTableChanged} />
          </Badge>
          {table?.tableStatus === "Đang yêu cầu thanh toán" && (
            <div style={{ display: "flex" }}>
              <Button
                onClick={handleCreateBill}
                disabled={isBillCreated}
                loading={creatingBill}
                style={{ margin: "0 5px" }}
              >
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
                customerName={order?.customerName}
                tableName={table?.tableName}
              >
                Xem bill
              </Bill>
            </div>
          )}
          {table?.tableStatus === "Đã thanh toán" && (
            <Button onClick={handleMakeTableEmpty} loading={emptyingTable}>
              Làm trống bàn
            </Button>
          )}
          {table?.totalDish > 0 && (
            <ListDish
              tableId={table?.tableId}
              handleUpdateOrderItemStatus={handleCreateBill}
            />
          )}
        </TableFooter>
      </TableCar>
    </Tables>
  );
};

export default TableOrder;
