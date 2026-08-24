import { Table } from "antd";
import styled from "styled-components";
export const Page = styled.main`
  min-height: 100vh;
  padding: 0 0 110px;
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 183, 77, 0.15),
      transparent 28%
    ),
    #fffaf4;
  color: #291b15;
`;
export const Headers = styled.header`
  height: 72px;
  padding: 0 max(16px, calc((100vw - 820px) / 2));
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 250, 244, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #eee1d8;

  @media (max-width: 480px) {
    height: 64px;
    grid-template-columns: 40px minmax(0, 1fr) 40px;
  }
`;
export const BackButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #eadfd7;
  border-radius: 13px;
  background: #fff;
  color: #33231c;
  cursor: pointer;
`;
export const Titles = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  span {
    display: block;
    margin-top: 2px;
    color: #9b7e6d;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 420px) {
    font-size: 16px;
  }
`;
export const OrderHero = styled.section`
  width: min(820px, calc(100% - 32px));
  margin: 24px auto;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 24px;
  color: #fff;
  background: linear-gradient(125deg, #2a1912, #754028 68%, #bd5927);
  box-shadow: 0 16px 40px rgba(60, 34, 20, 0.18);
  h1 {
    margin: 0 0 6px;
    font-size: clamp(24px, 5vw, 34px);
    letter-spacing: -0.04em;
  }
  p {
    margin: 0;
    color: #e8d5ca;
    font-size: 13px;
  }
  .hero-icon {
    width: 58px;
    height: 58px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 25px;
  }

  @media (max-width: 480px) {
    margin: 16px auto;
    padding: 19px 17px;
    border-radius: 20px;

    .hero-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      font-size: 21px;
    }
  }
`;
export const OrderList = styled.section`
  width: min(820px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
`;
export const OrderCard = styled.article`
  padding: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  border: 1px solid #eee1d8;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 9px 28px rgba(60, 34, 20, 0.06);
  h3 {
    margin: 0 0 6px;
    font-size: 16px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #927667;
    font-size: 12px;
  }
  .quantity {
    padding: 4px 8px;
    border-radius: 8px;
    background: #faf0e9;
    color: #ba5425;
    font-weight: 900;
  }
  .card-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    .card-side {
      align-items: stretch;
      flex-direction: row;
      justify-content: space-between;
    }
  }
`;
export const StatusButton = styled.span`
  padding: 7px 11px;
  border-radius: 999px;
  color: ${(p) => p.$tone?.color || "#75655c"};
  background: ${(p) => p.$tone?.background || "#eee8e4"};
  font-size: 10px;
  font-weight: 900;
  white-space: nowrap;
`;
export const SupportButton = styled.button`
  height: 36px;
  padding: 0 13px;
  border: 1px solid #eadbd2;
  border-radius: 11px;
  background: #fff;
  color: #725244;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    color: #c45927;
    border-color: #d98458;
    background: #fff8f3;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  border: 1px dashed #d9c6ba;
  border-radius: 22px;
  color: #94796a;
  background: rgba(255, 255, 255, 0.65);
  span {
    display: block;
    margin-bottom: 10px;
    font-size: 38px;
  }
`;
export const FooterButton = styled.footer`
  position: fixed;
  z-index: 25;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 14px max(16px, calc((100vw - 820px) / 2));
  display: grid;
  grid-template-columns: 1fr 1.35fr 1fr;
  gap: 10px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid #eee1d8;
  box-shadow: 0 -10px 30px rgba(60, 34, 20, 0.06);
  padding-bottom: max(14px, env(safe-area-inset-bottom));

  @media (max-width: 500px) {
    padding: 10px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
    gap: 7px;
    grid-template-columns: 0.85fr 1.3fr 0.85fr;
  }
`;
export const ActionButton = styled.button`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #e5d7ce;
  border-radius: 15px;
  background: #fff;
  color: #593d2f;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
  &:not(:disabled):hover {
    transform: translateY(-2px);
    border-color: #d68559;
    color: #bd5728;
    background: #fff8f3;
  }
  &.primary {
    border: 0;
    background: #d96b2b;
    color: #fff;
    box-shadow: 0 9px 22px rgba(217, 107, 43, 0.22);
  }
  &.primary:not(:disabled):hover {
    background: #b9501f;
    color: #fff;
  }
  &.bill-button {
    color: #8b572e;
    background: #fff8e9;
    border-color: #eddbb7;
  }
  &:disabled {
    color: #ae9f96;
    background: #f1ece8;
    border: 1px solid #e8dfda;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 500px) {
    height: 50px;
    padding: 0 7px;
    font-size: 11px;
    gap: 4px;
  }
`;
export const ContainerModal = styled.div`
  padding: 20px;
  border-radius: 18px;
  background: #fffaf4;
  border: 1px solid #eee1d8;
  .receipt-head {
    text-align: center;
    margin-bottom: 20px;
  }
  .receipt-head h2 {
    margin: 0 0 6px;
  }
  .receipt-head p {
    margin: 0;
    color: #90786a;
    font-size: 12px;
    line-height: 1.5;
  }
  .receipt-total {
    margin-top: 18px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    background: #2a1912;
    color: #fff;
    font-size: 16px;
  }
  .receipt-total > div {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 5px 0;
  }
  .receipt-total .grand-total {
    margin-top: 7px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 18px;
  }
  .receipt-time {
    text-align: center;
    margin-top: 12px;
    color: #90786a;
    font-size: 12px;
  }
  .payment-note {
    margin-top: 12px;
    padding: 13px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: 1px solid #f0d2bd;
    border-radius: 13px;
    color: #9f481e;
    background: #fff1e7;
    font-size: 13px;
    font-weight: 800;
    line-height: 1.5;
    text-align: center;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 14px;

    .receipt-total {
      padding: 13px;
      font-size: 14px;
    }
  }
`;
export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    text-align: center;
  }
  @media (max-width: 600px) {
    font-size: 10px;
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 7px 4px;
    }
  }
`;
