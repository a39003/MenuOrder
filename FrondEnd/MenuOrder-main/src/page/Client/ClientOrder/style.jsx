import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;
  padding: 0 0 190px;
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
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 250, 244, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #eee1d8;
`;
export const HeaderButton = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid #eadfd7;
  border-radius: 13px;
  background: #fff;
  color: #33231c;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(60, 34, 20, 0.06);
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
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;
export const CartIntro = styled.section`
  width: min(820px, calc(100% - 32px));
  margin: 24px auto 16px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  h1 {
    margin: 0;
    font-size: clamp(26px, 5vw, 36px);
    letter-spacing: -0.045em;
  }
  p {
    margin: 5px 0 0;
    color: #927667;
    font-size: 13px;
  }
  .count {
    padding: 8px 12px;
    border-radius: 999px;
    background: #fff0e5;
    color: #c15725;
    font-size: 12px;
    font-weight: 800;
  }
`;
export const ListContainer = styled.div`
  width: min(820px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
`;
export const CartItem = styled.article`
  padding: 18px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  gap: 15px;
  align-items: center;
  border: 1px solid #eee1d8;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 9px 28px rgba(60, 34, 20, 0.065);
  @media (max-width: 560px) {
    grid-template-columns: 54px 1fr;
    .item-actions {
      grid-column: 1/-1;
      padding-top: 12px;
      border-top: 1px solid #f2e9e3;
    }
  }
`;
export const ItemIcon = styled.div`
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #e88343, #b94d22);
  font-size: 20px;
  font-weight: 900;
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
  @media (max-width: 560px) {
    width: 54px;
    height: 54px;
  }
`;
export const Details = styled.div`
  min-width: 0;
  h3 {
    margin: 0 0 5px;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    color: #d05a25;
    font-weight: 900;
    font-size: 14px;
  }
  .note {
    width: 100%;
    margin-top: 10px;
  }
  .note .ant-input {
    height: 36px;
    border-radius: 10px;
    background: #faf6f2;
    border-color: #eee3db;
    font-size: 12px;
  }
`;
export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  .stepper {
    height: 40px;
    display: flex;
    align-items: center;
    border: 1px solid #eadfd7;
    border-radius: 13px;
    overflow: hidden;
  }
  .stepper button {
    width: 38px;
    height: 100%;
    border: 0;
    background: #faf5f1;
    color: #633b28;
    font-size: 17px;
    cursor: pointer;
  }
  .stepper button:hover {
    background: #f4e5da;
  }
  .stepper strong {
    width: 38px;
    text-align: center;
    font-size: 14px;
  }
  .delete {
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 12px;
    background: #fff0ee;
    color: #c94c3e;
    cursor: pointer;
  }
  .delete:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
export const Summary = styled.section`
  width: min(820px, calc(100% - 32px));
  margin: 18px auto 0;
  padding: 20px;
  border: 1px solid #eee1d8;
  border-radius: 20px;
  background: #fff;
  .row {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
    color: #826a5d;
  }
  .total {
    padding-top: 14px;
    margin-top: 14px;
    border-top: 1px dashed #dfcfc5;
    color: #291b15;
    font-size: 18px;
    font-weight: 900;
  }
  .total strong {
    color: #d05a25;
  }
`;
export const EmptyCart = styled.div`
  padding: 60px 20px;
  text-align: center;
  border: 1px dashed #d9c6ba;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  color: #94796a;
  span {
    display: block;
    margin-bottom: 12px;
    font-size: 38px;
  }
`;
export const Footer = styled.footer`
  position: fixed;
  z-index: 25;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 14px max(16px, calc((100vw - 820px) / 2));
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-top: 1px solid #eee1d8;
  box-shadow: 0 -10px 30px rgba(60, 34, 20, 0.06);
`;
export const FooterButton = styled.button`
  height: 54px;
  flex: 1;
  border: 1px solid #e5d7ce;
  border-radius: 16px;
  background: #fff;
  color: #593d2f;
  font-weight: 900;
  cursor: pointer;
  &.primary {
    flex: 1.6;
    border: 0;
    background: #d96b2b;
    color: #fff;
    box-shadow: 0 10px 24px rgba(217, 107, 43, 0.25);
  }
  &.primary:hover {
    background: #b9501f;
  }
  &:disabled {
    background: #ded5cf;
    color: #9b8e86;
    box-shadow: none;
    cursor: not-allowed;
  }
`;
