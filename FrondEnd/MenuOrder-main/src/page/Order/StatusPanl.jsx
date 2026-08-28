import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StatusButton } from "./style";
import TableOrder from "./TableOrder";
import { apiFetch } from "../../services/auth";

function StatusPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableStatus, setTableStatus] = useState(
    () => sessionStorage.getItem("admin-table-filter") || "Tất cả các bàn",
  );
  const [error, setError] = useState(null);

  const fetchTables = useCallback(
    async ({ initial = false } = {}) => {
      try {
        if (initial) setLoading(true);
        setError(null);
        const response = await apiFetch("/admin/tables", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const responseText = await response.text();
          let errorMessage = `Lỗi khi lấy dữ liệu (${response.status})`;
          if (responseText) {
            try {
              errorMessage = JSON.parse(responseText)?.message || errorMessage;
            } catch {
              errorMessage = responseText;
            }
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }

        setData(result);
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi lấy danh sách bàn:", error);
      } finally {
        if (initial) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTables({ initial: true });
    const interval = setInterval(fetchTables, 10000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  const tables = useMemo(() => {
    if (tableStatus === "Tất cả các bàn") return data;
    return data.filter((table) => table?.tableStatus === tableStatus);
  }, [data, tableStatus]);

  const handleClick = (status) => {
    setTableStatus(status);
    sessionStorage.setItem("admin-table-filter", status);
  };

  const quantity = (status) => {
    if (status === "Tất cả các bàn") {
      return data.length;
    }
    return data.filter((table) => table?.tableStatus === status).length || 0;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "10px",
        }}
      >
        <h2>Trạng thái của bàn:</h2>
        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          {[
            "Tất cả các bàn",
            "Đang order",
            "Đang phục vụ",
            "Đang yêu cầu thanh toán",
            "Đang trống",
          ].map((status) => (
            <StatusButton
              key={status}
              variant={tableStatus === status ? "contained" : "outlined"}
              onClick={() => handleClick(status)}
            >
              {`${capitalizeFirstLetter(status)} (${quantity(status)})`}
            </StatusButton>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, marginTop: "20px" }}>
        {loading ? (
          <p>Đang tải danh sách bàn...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : tables.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {tables.map((table) => (
              <TableOrder
                onTableChanged={fetchTables}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        ) : (
          <p>Không có bàn nào </p>
        )}
      </div>
    </div>
  );
}

export default StatusPanel;
