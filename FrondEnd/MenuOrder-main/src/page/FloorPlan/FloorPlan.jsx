import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClockCircleOutlined,
  CrownFilled,
  TeamOutlined,
} from "@ant-design/icons";
import { Empty, message, Spin } from "antd";
import { API_URL } from "../../config";
import {
  FloorBoard,
  FloorTabs,
  Legend,
  Page,
  SummaryGrid,
  TableCard,
  TableGrid,
} from "./style";

const statusClass = (status = "") => {
  if (status.includes("yêu cầu thanh toán")) return "payment";
  if (status.includes("phục vụ")) return "serving";
  if (status.includes("order")) return "ordering";
  return "empty";
};

const FloorPlan = () => {
  const [tables, setTables] = useState([]);
  const [floor, setFloor] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/tables`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setTables(Array.isArray(data) ? data : []);
    } catch {
      message.error("Không thể tải sơ đồ bàn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const timer = setInterval(fetchTables, 10000);
    return () => clearInterval(timer);
  }, [fetchTables]);

  const floors = useMemo(
    () =>
      [...new Set(tables.map((table) => table.floorNumber || 1))].sort(
        (a, b) => a - b,
      ),
    [tables],
  );
  const visibleTables =
    floor === "all"
      ? tables
      : tables.filter((table) => (table.floorNumber || 1) === floor);
  const groupedTables = floors
    .filter((number) => floor === "all" || floor === number)
    .map((number) => ({
      floor: number,
      tables: visibleTables.filter(
        (table) => (table.floorNumber || 1) === number,
      ),
    }));
  const totalSeats = visibleTables.reduce(
    (sum, table) => sum + Number(table.capacity || 4),
    0,
  );

  if (loading)
    return (
      <div style={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <Page>
      <header>
        <div>
          <span className="eyebrow">Không gian nhà hàng</span>
          <h1>SƠ ĐỒ BÀN</h1>
          <p>Theo dõi vị trí và trạng thái bàn theo thời gian thực.</p>
        </div>
      </header>

      <SummaryGrid>
        <div>
          <strong>{visibleTables.length}</strong>
          <span>Tổng số bàn</span>
        </div>
        <div>
          <strong>
            {
              visibleTables.filter(
                (t) => statusClass(t.tableStatus) === "empty",
              ).length
            }
          </strong>
          <span>Bàn trống</span>
        </div>
        <div>
          <strong>
            {visibleTables.filter((t) => t.tableType === "VIP").length}
          </strong>
          <span>Bàn VIP</span>
        </div>
        <div>
          <strong>{totalSeats}</strong>
          <span>Tổng chỗ ngồi</span>
        </div>
      </SummaryGrid>

      <FloorTabs>
        <button
          className={floor === "all" ? "active" : ""}
          onClick={() => setFloor("all")}
        >
          Tất cả
        </button>
        {floors.map((number) => (
          <button
            key={number}
            className={floor === number ? "active" : ""}
            onClick={() => setFloor(number)}
          >
            Tầng {number}
          </button>
        ))}
      </FloorTabs>

      <Legend>
        <span className="empty">Đang trống</span>
        <span className="ordering">Đang order</span>
        <span className="serving">Đang phục vụ</span>
        <span className="payment">Yêu cầu thanh toán</span>
      </Legend>

      {groupedTables.length ? (
        groupedTables.map((group) => (
          <FloorBoard key={group.floor}>
            <h2>Tầng {group.floor}</h2>
            <TableGrid>
              {group.tables.map((table) => {
                const tone = statusClass(table.tableStatus);
                const vip = table.tableType === "VIP";
                return (
                  <TableCard
                    key={table.tableId}
                    className={`${tone} ${vip ? "vip" : ""}`}
                  >
                    <div className="head">
                      <h3>
                        {vip && <CrownFilled />} {table.tableName}
                      </h3>
                      <span className="type">{vip ? "VIP" : "THƯỜNG"}</span>
                    </div>
                    <div className="capacity">
                      <TeamOutlined /> {table.capacity || 4} người
                    </div>
                    <div className="status">
                      <i /> {table.tableStatus}
                    </div>
                    {tone !== "empty" && (
                      <div className="meta">
                        <span>
                          <ClockCircleOutlined /> {table.totalTime || 0} phút
                        </span>
                        <strong>
                          {table.doneDish || 0}/{table.totalDish || 0} món
                        </strong>
                      </div>
                    )}
                  </TableCard>
                );
              })}
            </TableGrid>
          </FloorBoard>
        ))
      ) : (
        <Empty description="Chưa có bàn trên tầng này" />
      )}
    </Page>
  );
};

export default FloorPlan;
