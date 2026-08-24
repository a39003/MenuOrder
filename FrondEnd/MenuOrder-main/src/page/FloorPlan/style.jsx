import styled from "styled-components";

export const Page = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 38px 0 60px;
  header {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  .eyebrow {
    color: #cf6128;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h1 {
    margin: 5px 0;
    font-size: clamp(30px, 5vw, 46px);
    letter-spacing: -0.05em;
  }
  header p {
    margin: 0;
    color: #8d7365;
  }
`;

export const SummaryGrid = styled.section`
  margin: 25px 0 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  div {
    padding: 18px;
    display: flex;
    flex-direction: column;
    border: 1px solid #eadfd7;
    border-radius: 17px;
    background: #fff;
  }
  strong {
    color: #c65c27;
    font-size: 25px;
  }
  span {
    color: #8b7366;
    font-size: 12px;
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FloorTabs = styled.nav`
  display: flex;
  gap: 6px;
  padding: 6px;
  overflow-x: auto;
  border: 1px solid #eadfd7;
  border-radius: 16px;
  background: #fff;
  button {
    flex: 0 0 auto;
    padding: 11px 20px;
    border: 0;
    border-radius: 11px;
    background: transparent;
    color: #654c40;
    font-weight: 800;
    cursor: pointer;
  }
  button.active {
    color: #fff;
    background: #d96b2b;
  }
`;

export const Legend = styled.div`
  margin: 15px 0 22px;
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  flex-wrap: wrap;
  color: #796357;
  font-size: 12px;
  span::before {
    content: "";
    width: 9px;
    height: 9px;
    display: inline-block;
    margin-right: 7px;
    border-radius: 50%;
    background: #269348;
  }
  .ordering::before {
    background: #dd8b00;
  }
  .serving::before {
    background: #2477ad;
  }
  .payment::before {
    background: #d7332f;
  }
`;

export const FloorBoard = styled.section`
  margin-top: 18px;
  padding: 25px;
  border: 1px solid #eadfd7;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 14px 40px rgba(60, 34, 20, 0.06);
  > h2 {
    margin: 0 0 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #df7b3c;
    font-size: 22px;
  }
  @media (max-width: 520px) {
    padding: 16px;
  }
`;

export const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
`;

export const TableCard = styled.article`
  min-height: 178px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd2cb;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(60, 34, 20, 0.07);
  &.vip {
    border: 2px solid #dfa000;
    box-shadow: 0 9px 24px rgba(203, 143, 12, 0.14);
  }
  .head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }
  h3 {
    margin: 0;
    font-size: 19px;
  }
  h3 svg {
    color: #d99a00;
  }
  .type {
    padding: 5px 9px;
    border-radius: 999px;
    color: #75655d;
    background: #f0ece9;
    font-size: 10px;
    font-weight: 900;
  }
  &.vip .type {
    color: #fff;
    background: #d99a00;
  }
  .capacity {
    margin: 13px 0;
    color: #7d675b;
    font-size: 13px;
  }
  .status {
    color: #258c46;
    font-weight: 800;
  }
  .status i {
    width: 9px;
    height: 9px;
    display: inline-block;
    margin-right: 7px;
    border-radius: 50%;
    background: currentColor;
  }
  &.ordering .status {
    color: #d57e00;
  }
  &.serving .status {
    color: #2477ad;
  }
  &.payment .status {
    color: #d7332f;
  }
  .meta {
    margin-top: auto;
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee5df;
    color: #80695d;
    font-size: 12px;
  }
`;
