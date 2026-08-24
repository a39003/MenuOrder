import styled from "styled-components";
export const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 34px 24px 60px;
  @media (max-width: 640px) {
    padding: 24px 16px 48px;
  }
`;
export const Hero = styled.section`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
  .eyebrow {
    color: #cf642c;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .title {
    margin: 7px 0 5px;
    font-size: clamp(29px, 4vw, 42px);
    line-height: 1;
    letter-spacing: -0.045em;
  }
  .sub {
    margin: 0;
    color: #8c7568;
    font-size: 14px;
  }
  .period {
    display: flex;
    padding: 4px;
    border: 1px solid #eadfd7;
    border-radius: 13px;
    background: #fff;
  }
  .period button {
    padding: 9px 13px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #765f53;
    font-weight: 800;
    cursor: pointer;
  }
  .period button.active {
    background: #2b1c15;
    color: #fff;
  }
  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
export const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
export const StatCard = styled.article`
  min-height: 142px;
  padding: 20px;
  border: 1px solid #eadfd7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(76, 49, 34, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #846e62;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .icon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: #ca5f29;
    background: #fff0e4;
    font-size: 18px;
  }
  .icon.gold {
    color: #a97100;
    background: #fff1c8;
  }
  .value {
    font-size: 27px;
    font-weight: 900;
    letter-spacing: -0.035em;
  }
  .hint {
    color: #9c877c;
    font-size: 12px;
  }
`;
export const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr);
  gap: 18px;
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
export const Panel = styled.article`
  padding: 22px;
  border: 1px solid #eadfd7;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(76, 49, 34, 0.05);
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 23px;
  }
  .head h2 {
    margin: 0;
    font-size: 18px;
  }
  .head span {
    color: #9a8174;
    font-size: 12px;
  }
  &.wide {
    grid-column: 1 / -1;
  }
`;
export const Chart = styled.div`
  height: 250px;
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding-top: 16px;
  .column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
  .amount {
    font-size: 10px;
    color: #8c7568;
    white-space: nowrap;
  }
  .track {
    width: min(48px, 80%);
    height: 190px;
    display: flex;
    align-items: flex-end;
    border-radius: 12px;
    background: #fbf5f0;
    overflow: hidden;
  }
  .bar {
    width: 100%;
    min-height: 4px;
    border-radius: 12px 12px 0 0;
    background: linear-gradient(180deg, #f49a5e, #cf5c26);
    transition: height 0.3s;
  }
  .month-bar {
    background: linear-gradient(180deg, #e4b34b, #b96622);
  }
  .label {
    font-size: 11px;
    color: #8f786c;
  }
  &.monthly {
    overflow-x: auto;
  }
  &.monthly .column {
    min-width: 58px;
  }
`;
export const TopList = styled.div`
  display: grid;
  gap: 10px;
  .item {
    display: grid;
    grid-template-columns: 34px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 11px;
    border-radius: 14px;
    background: #fbf6f2;
  }
  .rank {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #2b1c15;
    color: #fff;
    font-weight: 900;
  }
  .name {
    font-weight: 800;
    font-size: 13px;
  }
  .revenue {
    display: block;
    margin-top: 3px;
    color: #9b8275;
    font-size: 11px;
  }
  .qty {
    color: #c75e28;
    font-weight: 900;
    font-size: 13px;
  }
`;
