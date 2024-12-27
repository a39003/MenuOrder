import React, { useEffect, useState } from 'react';
import { StatusButton } from './style';
import TableOrder from './TableOrder';

function StatusPanel() {
  const [data, setData] = useState([]); 
  const [tables, setTables] = useState([]); 
  const [status, setStatus] = useState(true); 
  const [tableStatus, setTableStatus] = useState("Tất cả các bàn"); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setError(null); 
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authorization token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await fetch("http://localhost:8080/admin/tables", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }

        setData(result);
        setTables(result.filter((table) => table?.tableStatus === tableStatus || tableStatus === "Tất cả các bàn")); 
      } catch (error) {
        setError(error.message);
        console.error("Lỗi khi lấy danh sách bàn:", error);
      } finally {
        setStatus(false);
      }
    };
    fetchTables();
    const interval = setInterval(() => {
      fetchTables();
    }, 5000);
    return () => clearInterval(interval);
  }, [tableStatus]);

  const handleClick = (status) => {
    setTableStatus(status); 
    if (status === "Tất cả các bàn") {
      setTables(data); 
    } else {
      setTables(data.filter((table) => table?.tableStatus === status)); 
    }
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
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: "10px" }}>
        <h2>Trạng thái của bàn:</h2>
        <div style={{ display: 'flex', gap: "2px", flexWrap: "wrap" }}>
          {["Tất cả các bàn", "Đang order", "Đang phục vụ", "Đang yêu cầu thanh toán", "Đang trống"].map((status) => (
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
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : tables.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: "15px" }}>
            {tables.map((table) => (
              <TableOrder setStatus={setStatus} key={table.tableId} table={table} />
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
