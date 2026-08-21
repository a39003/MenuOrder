import React, { useEffect, useState } from 'react';
import { StatusButton } from './style';
import TableOrder from './TableOrder';
import { API_URL } from '../../config';

function StatusPanel() {
  const [data, setData] = useState([]);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState(true);
  const [tableStatus, setTableStatus] = useState("Táº¥t cáº£ cÃ¡c bÃ n");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authorization token khÃ´ng tá»“n táº¡i. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.");
        }

        const response = await fetch(`${API_URL}/admin/tables`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Lá»—i khi láº¥y dá»¯ liá»‡u: ${response.statusText}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Dá»¯ liá»‡u tráº£ vá» khÃ´ng há»£p lá»‡.");
        }

        setData(result);
        setTables(result.filter((table) => table?.tableStatus === tableStatus || tableStatus === "Táº¥t cáº£ cÃ¡c bÃ n"));
      } catch (error) {
        setError(error.message);
        console.error("Lá»—i khi láº¥y danh sÃ¡ch bÃ n:", error);
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
    if (status === "Táº¥t cáº£ cÃ¡c bÃ n") {
      setTables(data);
    } else {
      setTables(data.filter((table) => table?.tableStatus === status));
    }
  };

  const quantity = (status) => {
    if (status === "Táº¥t cáº£ cÃ¡c bÃ n") {
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
        <h2>Tráº¡ng thÃ¡i cá»§a bÃ n:</h2>
        <div style={{ display: 'flex', gap: "2px", flexWrap: "wrap" }}>
          {["Táº¥t cáº£ cÃ¡c bÃ n", "Äang order", "Äang phá»¥c vá»¥", "Äang yÃªu cáº§u thanh toÃ¡n", "Äang trá»‘ng"].map((status) => (
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
          <p>KhÃ´ng cÃ³ bÃ n nÃ o </p>
        )}
      </div>
    </div>
  );
}

export default StatusPanel;
