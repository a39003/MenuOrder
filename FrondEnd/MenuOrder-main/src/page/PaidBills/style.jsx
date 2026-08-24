import styled from "styled-components";
export const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 34px 24px 60px;
  @media (max-width: 640px) {
    padding: 24px 16px;
  }
`;
export const Head = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
  .eyebrow {
    color: #cf642c;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  h1 {
    margin: 7px 0 5px;
    font-size: clamp(29px, 4vw, 40px);
    letter-spacing: -0.045em;
  }
  p {
    margin: 0;
    color: #8c7568;
  }
  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const Summary = styled.div`
  padding: 14px 18px;
  border-radius: 16px;
  color: #fff;
  background: #2b1c15;
  min-width: 210px;
  span {
    display: block;
    color: #cdbcb2;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  strong {
    display: block;
    margin-top: 4px;
    font-size: 21px;
  }
`;
export const Filters = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
  padding: 13px;
  border: 1px solid #eadfd7;
  border-radius: 18px;
  background: #fff;
  input {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e4d8d0;
    border-radius: 11px;
    outline: none;
    color: #4c382e;
  }
  input[type="search"] {
    flex: 1;
    min-width: 180px;
  }
  button {
    height: 40px;
    padding: 0 17px;
    border: 0;
    border-radius: 11px;
    background: #d96b2b;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
  }
  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;
export const Overview = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  article {
    padding: 17px;
    border: 1px solid #eadfd7;
    border-radius: 17px;
    background: #fff;
  }
  span,
  small {
    display: block;
    color: #91796c;
    font-size: 11px;
  }
  strong {
    display: block;
    margin: 5px 0 3px;
    color: #2b1c15;
    font-size: 20px;
  }
  @media (max-width: 850px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
export const Card = styled.section`
  padding: 5px;
  border: 1px solid #eadfd7;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(76, 49, 34, 0.05);
  overflow: hidden;
  .table-wrap {
    overflow: auto;
  }
  .bill-id {
    font-weight: 900;
    color: #c25a28;
  }
  .table-name {
    font-weight: 800;
  }
  .date {
    color: #8b7468;
  }
  .amount {
    font-weight: 900;
    color: #2b1c15;
  }
  .table-info {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .table-info span {
    padding: 3px 7px;
    border-radius: 999px;
    background: #f1ece8;
    color: #776359;
    font-size: 9px;
    font-weight: 900;
  }
  .table-info span.vip {
    background: #fff0c7;
    color: #9a6800;
  }
`;
export const Receipt = styled.div`
  .receipt-head {
    padding: 18px;
    border-radius: 18px;
    background: #2b1c15;
    color: #fff;
  }
  .receipt-head h2 {
    margin: 0 0 5px;
  }
  .receipt-head p {
    margin: 0;
    color: #ccb9ae;
  }
  .meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 16px 0;
  }
  .meta div {
    padding: 12px;
    border-radius: 13px;
    background: #fbf5f0;
  }
  .meta span {
    display: block;
    color: #9a8377;
    font-size: 11px;
  }
  .meta strong {
    display: block;
    margin-top: 4px;
  }
  .line {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 12px 2px;
    border-bottom: 1px solid #eee4dd;
  }
  .line small {
    display: block;
    margin-top: 3px;
    color: #947d70;
  }
  .total {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #2b1c15;
    font-size: 18px;
  }
  .charge-summary {
    margin-top: 14px;
    padding: 13px 15px;
    display: grid;
    gap: 9px;
    border-radius: 14px;
    background: #fbf5f0;
  }
  .charge-summary div {
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
  .charge-summary .vip-fee {
    color: #a66c00;
    font-weight: 800;
  }
  .total strong {
    color: #c55d29;
  }
  @media (max-width: 520px) {
    .meta {
      grid-template-columns: 1fr;
    }
  }
`;
