import styled from "styled-components";

export const KitchenPage = styled.main`
  min-height: calc(100vh - 72px);
  padding: 32px clamp(14px, 3vw, 38px) 50px;
  background: #fff9f4;
  color: #2b1a13;
  .kitchen-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:22px; }
  h1 { margin:0; font-size:clamp(27px,4vw,40px); }
  .subtitle { margin:6px 0 0; color:#94786a; }
  .updated { color:#a45a32; font-weight:700; white-space:nowrap; }
`;

export const KitchenBoard = styled.section`
  display:grid;
  grid-template-columns:repeat(4,minmax(240px,1fr));
  gap:14px;
  overflow-x:auto;
  align-items:start;
  padding-bottom:10px;
`;

export const KitchenLane = styled.div`
  min-width:240px;
  padding:14px;
  border:1px solid #ecdfd6;
  border-radius:18px;
  background:#f7eee8;
  .lane-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .lane-head h2 { margin:0; font-size:16px; }
  .count { display:grid; place-items:center; min-width:26px; height:26px; padding:0 7px; border-radius:999px; background:#2d1b14; color:#fff; font-size:12px; }
  .empty { padding:25px 6px; text-align:center; color:#ad9588; }
`;

export const KitchenTicket = styled.article`
  margin-bottom:10px;
  padding:14px;
  border-radius:14px;
  background:#fff;
  box-shadow:0 7px 20px rgba(68,38,24,.07);
  border-left:4px solid ${({ $done }) => $done ? "#55a06e" : "#db6d32"};
  .ticket-top { display:flex; justify-content:space-between; gap:8px; }
  .table { font-weight:900; }
  .time { color:#bd5426; font-size:12px; font-weight:800; }
  h3 { margin:10px 0 4px; font-size:15px; }
  .qty { color:#d45f28; font-weight:900; }
  .note { margin:7px 0 11px; padding:7px 9px; border-radius:8px; background:#fff5ec; color:#755346; font-size:12px; }
  button { width:100%; min-height:38px; border:0; border-radius:10px; background:#d96b2b; color:#fff; font-weight:800; cursor:pointer; }
  button:disabled { opacity:.55; cursor:wait; }
`;
