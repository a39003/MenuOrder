import React, { useEffect, useMemo, useState } from "react";
import { Button, Empty, Modal, Spin, Table, message } from "antd";
import {
  EyeOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Card, Filters, Head, Overview, Page, Receipt, Summary } from "./style";
import { API_URL } from "../../config";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;
const formatDate = (value) =>
  value ? new Date(value).toLocaleString("vi-VN") : "—";
const today = new Date().toISOString().slice(0, 10);
const firstDay = () => {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().slice(0, 10);
};

const PaidBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    from: firstDay(),
    to: today,
    search: "",
  });
  const [query, setQuery] = useState(filters);
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(query).forEach(
      ([key, value]) => value && params.set(key, value),
    );
    fetch(`${API_URL}/admin/bills?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            (await response.json()).message || "Không tải được hóa đơn",
          );
        return response.json();
      })
      .then(setBills)
      .catch((error) => message.error(error.message))
      .finally(() => setLoading(false));
  }, [query]);
  const total = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0),
    [bills],
  );
  const foodRevenue = useMemo(
    () => bills.reduce((sum, bill) => sum + Number(bill.foodAmount || 0), 0),
    [bills],
  );
  const tableRevenue = useMemo(
    () =>
      bills.reduce((sum, bill) => sum + Number(bill.tableServiceFee || 0), 0),
    [bills],
  );
  const vipBills = useMemo(
    () => bills.filter((bill) => bill.tableType === "VIP").length,
    [bills],
  );
  const columns = [
    {
      title: "Mã bill",
      dataIndex: "billId",
      render: (value) => <span className="bill-id">#{value}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      render: (value) => (
        <span className="table-name">{value || "Khách hàng"}</span>
      ),
    },
    {
      title: "Bàn",
      key: "table",
      render: (_, record) => (
        <div className="table-info">
          <strong>{record.tableName}</strong>
          <span className={record.tableType === "VIP" ? "vip" : "regular"}>
            {record.tableType || "THƯỜNG"}
          </span>
        </div>
      ),
    },
    { title: "Mã đơn", dataIndex: "orderId", render: (value) => `#${value}` },
    {
      title: "Thu bàn",
      dataIndex: "tableServiceFee",
      align: "right",
      render: money,
    },
    {
      title: "Thời gian",
      dataIndex: "paidAt",
      render: (value) => <span className="date">{formatDate(value)}</span>,
    },
    { title: "Số món", dataIndex: "totalItems", align: "center" },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      align: "right",
      render: (value) => <span className="amount">{money(value)}</span>,
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setSelected(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];
  return (
    <Page>
      <Head>
        <div>
          <span className="eyebrow">Tài chính</span>
          <h1>Lịch sử thanh toán</h1>
          <p>Tra cứu hóa đơn theo tên khách hàng, bàn hoặc mã đơn.</p>
        </div>
        <Summary>
          <span>Doanh thu trong bộ lọc</span>
          <strong>{money(total)}</strong>
          <span>{bills.length} hóa đơn</span>
        </Summary>
      </Head>
      <Overview>
        <article>
          <span>Tiền món ăn</span>
          <strong>{money(foodRevenue)}</strong>
          <small>Doanh thu từ thực đơn</small>
        </article>
        <article>
          <span>Thu thêm bàn VIP</span>
          <strong>{money(tableRevenue)}</strong>
          <small>{vipBills} hóa đơn bàn VIP</small>
        </article>
        <article>
          <span>Giá trị trung bình</span>
          <strong>{money(bills.length ? total / bills.length : 0)}</strong>
          <small>Mỗi hóa đơn đã thanh toán</small>
        </article>
        <article>
          <span>Cơ cấu bàn</span>
          <strong>{vipBills} VIP</strong>
          <small>{bills.length - vipBills} bàn thường</small>
        </article>
      </Overview>
      <Filters>
        <input
          type="search"
          placeholder="Tìm tên khách, mã bill, mã đơn hoặc tên bàn"
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
        />
        <input
          aria-label="Từ ngày"
          type="date"
          value={filters.from}
          onChange={(event) =>
            setFilters({ ...filters, from: event.target.value })
          }
        />
        <input
          aria-label="Đến ngày"
          type="date"
          value={filters.to}
          onChange={(event) =>
            setFilters({ ...filters, to: event.target.value })
          }
        />
        <button
          onClick={() => setQuery({ ...filters })}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <LoadingOutlined spin /> : <SearchOutlined />}{" "}
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </Filters>
      <Card>
        <div className="table-wrap">
          {loading ? (
            <div style={{ display: "grid", placeItems: "center", height: 300 }}>
              <Spin size="large" />
            </div>
          ) : bills.length ? (
            <Table
              rowKey="billId"
              columns={columns}
              dataSource={bills}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: 900 }}
            />
          ) : (
            <Empty
              style={{ padding: 70 }}
              description="Không có hóa đơn trong thời gian này"
            />
          )}
        </div>
      </Card>
      <Modal
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={null}
        width={620}
        centered
        title={null}
      >
        {selected && (
          <Receipt>
            <div className="receipt-head">
              <h2>TLU Quán · Hóa đơn #{selected.billId}</h2>
              <p>
                Khách hàng:{" "}
                <strong>{selected.customerName || "Khách hàng"}</strong> · Bàn:{" "}
                <strong>{selected.tableName}</strong>
                {" · "}
                <strong>{selected.tableType || "THƯỜNG"}</strong>
              </p>
            </div>
            <div className="meta">
              <div>
                <span>Khách hàng</span>
                <strong>{selected.customerName || "Khách hàng"}</strong>
              </div>
              <div>
                <span>Bàn · Loại bàn · Mã đơn</span>
                <strong>
                  {selected.tableName} · {selected.tableType || "THƯỜNG"} · #
                  {selected.orderId}
                </strong>
              </div>
              <div>
                <span>Thời gian</span>
                <strong>{formatDate(selected.paidAt)}</strong>
              </div>
            </div>
            {selected.items?.map((item, index) => (
              <div className="line" key={`${item.billItemName}-${index}`}>
                <div>
                  <strong>{item.billItemName}</strong>
                  <small>
                    {item.billItemQuantity} × {money(item.billItemPrice)}
                  </small>
                </div>
                <strong>
                  {money(item.billItemQuantity * item.billItemPrice)}
                </strong>
              </div>
            ))}
            <div className="charge-summary">
              <div>
                <span>Tiền món ăn</span>
                <strong>{money(selected.foodAmount)}</strong>
              </div>
              <div className={selected.tableType === "VIP" ? "vip-fee" : ""}>
                <span>
                  Thu bàn {selected.tableType === "VIP" ? "VIP" : "thường"}
                </span>
                <strong>{money(selected.tableServiceFee)}</strong>
              </div>
            </div>
            <div className="total">
              <span>Tổng thanh toán</span>
              <strong>{money(selected.totalAmount)}</strong>
            </div>
          </Receipt>
        )}
      </Modal>
    </Page>
  );
};
export default PaidBills;
