import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Modal, message } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Foor from "../../costormer/Components/Foor/Foor";
import { Conter } from "./style";
import { convertToTime } from "../../costormer/Time/time";
import {
  API_URL,
  PAYMENT_ACCOUNT_NAME,
  PAYMENT_ACCOUNT_NO,
  PAYMENT_BANK,
} from "../../config";

const { Title } = Typography;

const Bill = ({
  children,
  bill,
  tableId,
  orderId,
  isOpen,
  setIsOpen,
  setBill,
  onBillDeleted,
  table,
  setStatus,
  customerName,
  tableName,
}) => {
  const navigate = useNavigate();
  const [deletingBill, setDeletingBill] = useState(false);
  const [acceptingPayment, setAcceptingPayment] = useState(false);

  const paymentContent = `TLU BILL ${bill?.billId || orderId}`;
  const paymentQrUrl = `https://img.vietqr.io/image/${PAYMENT_BANK}-${PAYMENT_ACCOUNT_NO}-compact2.png?amount=${Number(
    bill?.totalAmount || 0,
  )}&addInfo=${encodeURIComponent(paymentContent)}&accountName=${encodeURIComponent(
    PAYMENT_ACCOUNT_NAME,
  )}`;

  const handlePrintBill = () => {
    document.body.classList.add("printing-admin-bill");
    const finishPrinting = () =>
      document.body.classList.remove("printing-admin-bill");
    window.addEventListener("afterprint", finishPrinting, { once: true });
    window.print();
    window.setTimeout(finishPrinting, 1000);
  };

  const handleDeleteBill = async () => {
    if (deletingBill) return;
    setDeletingBill(true);
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/bill`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        message.success("Xóa bill thành công");
        setBill(null);
        onBillDeleted(); // Update parent component if needed
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert(error.message || "Xóa bill không thành công");
    } finally {
      setDeletingBill(false);
    }
  };

  const [order, setOrder] = useState(null);
  const [isBillCreated, setIsBillCreated] = useState(false);

  const fetchOrderDetails = async () => {
    if (!table?.tableId) return;
    try {
      const response = await fetch(
        `${API_URL}/orders/tables/${table.tableId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        updateDoneDishCount(data.orderItemResponseDTO);
      } else {
        console.error("Failed to fetch order details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const updateDoneDishCount = (orderItems) => {
    if (orderItems && orderItems.length > 0) {
      const doneDishCount = orderItems.filter(
        (item) => item.dishStatus === "Đã ra món",
      ).length;
      const updatedTable = { ...table, doneDish: doneDishCount };
      setStatus(updatedTable);
    }
  };

  const fetchBillDetails = async () => {
    if (!order?.orderId) return;

    const savedBill = localStorage.getItem(`bill-${order.orderId}`);
    if (savedBill) {
      setBill(JSON.parse(savedBill));
      setIsBillCreated(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${order.orderId}/bill`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (!data?.message) {
          setBill(data);
          setIsBillCreated(true);
          localStorage.setItem(`bill-${order.orderId}`, JSON.stringify(data));
        } else {
          setBill(null);
          setIsBillCreated(false);
        }
      } else {
        console.error("Failed to fetch bill details:", response.statusText);
        setBill(null);
        setIsBillCreated(false);
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  // Make table empty and update table status
  const handleMakeTableEmpty = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/tables/${tableId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        message.success("Làm trống bàn thành công");
        setStatus({ ...table, tableStatus: "Bàn trống" });
      } else {
        console.success("Làm trống bàn thành công", response.statusText);
      }
    } catch (success) {
      message.success("Làm trống bàn thành công:", success);
    }
  };

  const handleAcceptPayment = async () => {
    if (acceptingPayment) return;
    setAcceptingPayment(true);
    try {
      const response = await fetch(
        `${API_URL}/admin/tables/${tableId}/payment/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        message.success("Xác nhận thanh toán thành công");
        await handleMakeTableEmpty();
        window.location.reload();

        setIsOpen(false);
      } else {
        const successData = await response.json();
        throw new Error(successData.message || "Failed to accept payment");
      }
    } catch (error) {
      console.error("Error accepting payment:", error);
      message.error(error.message || "Xác nhận thanh toán không thành công");
    } finally {
      setAcceptingPayment(false);
    }
  };

  const dataSource = [
    {
      key: "1",
      name: "Bò sốt tiêu đen",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "2",
      name: "Dê tái chanh",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "3",
      name: "Bò xào rau muống",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    { key: "4", name: "Dê hấp", quantity: 1, price: 239000, total: 239000 },
    {
      key: "5",
      name: "Thịt lợn quay",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
    {
      key: "6",
      name: "Chân giò hầm",
      quantity: 1,
      price: 239000,
      total: 239000,
    },
  ];

  const columns = [
    { title: "Tên món", dataIndex: "name", key: "name" },
    { title: "SL", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) => price?.toLocaleString(),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => total?.toLocaleString(),
    },
  ];

  const totalAmount = dataSource.reduce((sum, item) => sum + item.total, 0);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(true)}
        disabled={bill === null}
      >
        {children}
      </Button>
      <Modal
        title="Chi Tiết Hóa Đơn"
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        centered
        width={720}
      >
        <div
          className="admin-bill-print"
          style={{
            background: "#DAD1D1",
            padding: "10px",
            borderRadius: "9px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            TLU QUÁN
          </Title>
          <Typography.Text style={{ display: "block", textAlign: "center" }}>
            Địa Chỉ: Nghiêm Xuân Yên - Đại Kim - Hoàng Mai - Hà Nội <br />
            SDT: 012345678
          </Typography.Text>
          <Typography.Text
            style={{
              display: "block",
              textAlign: "center",
              margin: "10px 0 16px",
              fontWeight: 700,
            }}
          >
            Khách hàng: {customerName || bill?.customerName || "Khách hàng"} ·
            Bàn: {tableName || bill?.tableName || tableId}
          </Typography.Text>

          <Table
            dataSource={bill?.billItemResponseDTOS || []}
            columns={[
              {
                title: "Tên món",
                dataIndex: "billItemName",
                key: "billItemName",
              },
              {
                title: "Số lượng",
                dataIndex: "billItemQuantity",
                key: "billItemQuantity",
              },
              {
                title: "Giá tiền",
                dataIndex: "billItemPrice",
                key: "billItemPrice",
                render: (billItemPrice) =>
                  billItemPrice?.toLocaleString() + " đ",
              },
              {
                title: "Thành tiền",
                key: "totalPrice",
                render: (text, record) => {
                  const total = record.billItemQuantity * record.billItemPrice;
                  return total.toLocaleString();
                },
              },
            ]}
            pagination={false}
            bordered
            size="small"
            rowKey={(record, index) => record.billItemId || index}
            summary={() => (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <b>Tổng Tiền:</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <b>{bill?.totalAmount?.toLocaleString()} đ</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    index={0}
                    colSpan={4}
                    style={{ textAlign: "center" }}
                  >
                    <b>Thời gian: {convertToTime(bill?.billDateTime)}</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )}
          />
          <div className="admin-payment-qr">
            <div>
              <h3>Quét mã để thanh toán</h3>
              <p>VietinBank · {PAYMENT_ACCOUNT_NO}</p>
              <strong>{PAYMENT_ACCOUNT_NAME}</strong>
              <p>
                Nội dung: <strong>{paymentContent}</strong>
              </p>
            </div>
            <img
              src={paymentQrUrl}
              alt={`QR thanh toán hóa đơn ${bill?.billId || orderId}`}
            />
          </div>
        </div>
        <div className="admin-bill-actions" style={{ marginTop: "16px" }}>
          <Button
            size="large"
            icon={<PrinterOutlined />}
            onClick={handlePrintBill}
          >
            In / Lưu PDF
          </Button>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#454545",
              color: "#fff",
              borderRadius: "20px",
              padding: "5px 30px",
              border: "none",
            }}
            onClick={handleAcceptPayment}
            loading={acceptingPayment}
          >
            Xác Nhận Thanh Toán
          </Button>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#454545",
              color: "#fff",
              borderRadius: "20px",
              padding: "5px 30px",
              border: "none",
            }}
            onClick={handleDeleteBill}
            loading={deletingBill}
          >
            Hủy hóa đơn
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Bill;
