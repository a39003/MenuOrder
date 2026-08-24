import { Button } from "antd";
import styled from "styled-components";

export const Tables = styled.div`
  display: block;
`;
export const TableCar = styled.article`
  min-height: 210px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #35261f;
  background: #fff;
  border: 1px solid #eee4dc;
  border-radius: 20px;
  box-shadow: 0 12px 34px rgba(60, 34, 20, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 42px rgba(60, 34, 20, 0.13);
  }

  @media (max-width: 480px) {
    min-height: 190px;
    padding: 16px;
    border-radius: 16px;
  }
`;
export const TableHeader = styled.div`
  font-size: 19px;
  font-weight: 800;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  .table-detail {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: #826b5e;
    font-size: 10px;
    font-weight: 700;
    flex-wrap: wrap;
  }
  .table-detail > svg,
  .table-detail > strong {
    color: #c88909;
  }
`;
export const Status = styled.span`
  padding: 6px 9px;
  max-width: 125px;
  border-radius: 999px;
  color: #a84d21;
  background: #fff0e5;
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  font-weight: 800;
`;
export const TableBody = styled.div`
  margin: 18px 0;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  border-radius: 14px;
  background: #faf5f1;
  color: #796257;
`;
export const TimeSection = styled.div`
  font-size: 13px;
  display: flex;
  align-items: center;
`;
export const DishesSection = styled.div`
  font-size: 13px;
  font-weight: 700;
`;
export const TableFooter = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .ant-btn {
    border-radius: 10px;
  }
`;
export const AdminIconButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid #eadfd7;
  border-radius: 12px;
  color: #704c3c;
  background: #fff;
  cursor: pointer;
  font-size: 17px;
  transition: 0.2s ease;
  &:hover {
    color: #fff;
    background: #d96b2b;
    border-color: #d96b2b;
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(217, 107, 43, 0.2);
  }
`;
export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 430px;
  overflow-y: auto;
`;
export const NotificationItem = styled.div`
  padding: 15px;
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 12px;
  align-items: center;
  border: 1px solid #eee3dc;
  border-radius: 15px;
  background: #fffaf7;
  .notice-icon {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    color: #c25a29;
    background: #fff0e5;
    font-size: 17px;
  }
  strong {
    display: block;
    margin-bottom: 4px;
    color: #3a2921;
  }
  .time {
    color: #9b8173;
    font-size: 11px;
    white-space: nowrap;
  }
  @media (max-width: 520px) {
    grid-template-columns: 38px 1fr;
    .time {
      grid-column: 2;
    }
  }
`;
export const OrderModalHead = styled.div`
  margin-bottom: 18px;
  padding: 17px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(125deg, #2a1912, #754028);
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
  }
  .sub {
    color: #ddc9bd;
    font-size: 12px;
  }
  .count {
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 12px;
    font-weight: 800;
  }
`;
export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .ant-btn {
    width: 30px;
    height: 30px;
    padding: 0;
    border-radius: 9px;
  }
  .ant-input-number {
    width: 48px;
    border-radius: 9px;
  }
  .ant-input-number-input {
    text-align: center;
  }
`;
export const OrderStatusTag = styled.span`
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  color: ${(p) => (p.$done ? "#287849" : "#976816")};
  background: ${(p) => (p.$done ? "#e7f6ed" : "#fff3d8")};
  font-size: 10px;
  font-weight: 900;
`;
export const StatusFooter = styled(Button)`
  font-size: 13px;
  border-radius: 10px;
`;
export const Icons = styled.div`
  font-size: 18px;
`;
export const Conter = styled.main`
  min-height: calc(100vh - 72px) !important;
  padding: 40px max(24px, calc((100vw - 1180px) / 2)) !important;
  background: #fffaf4 !important;
  &::before {
    content: "Tổng quan phục vụ";
    display: block;
    margin-bottom: 24px;
    color: #2a1912;
    font-size: clamp(26px, 4vw, 36px);
    font-weight: 800;
    letter-spacing: -0.04em;
  }
  > div {
    display: block;
  }
  > div > div:first-child {
    padding: 18px !important;
    border: 1px solid #eee4dc;
    border-radius: 18px;
    background: #fff;
  }
  > div > div:first-child h2 {
    margin: 0 0 12px;
    font-size: 15px;
    color: #796257;
  }
  > div > div:last-child > div {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 18px !important;
  }

  @media (max-width: 768px) {
    min-height: calc(100vh - 64px) !important;
    padding: 28px 16px !important;

    &::before {
      margin-bottom: 18px;
    }

    > div > div:first-child {
      padding: 14px !important;
      border-radius: 15px;
    }

    > div > div:last-child > div {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
      gap: 14px !important;
    }
  }

  @media (max-width: 420px) {
    padding: 22px 12px !important;
  }
`;
export const StatusButton = styled(Button)`
  display: block;
  margin: 8px;
  border-radius: 10px;
  font-weight: 600;
  background: ${(props) =>
    props.variant === "contained" ? "#d96b2b" : "#fff5ee"};

  @media (max-width: 520px) {
    max-width: 100%;
    height: auto;
    min-height: 36px;
    margin: 4px;
    white-space: normal;
  }
`;
