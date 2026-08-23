import styled from "styled-components";
export const Page = styled.main`
  min-height: 100vh;
  padding-bottom: 38px;
  background: #fffaf4;
  color: #291b15;
`;
export const Headers = styled.header`
  padding: 18px 24px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.02em;
  background: rgba(255, 250, 244, 0.9);
  border-bottom: 1px solid #eee1d8;

  @media (max-width: 480px) {
    padding: 15px 16px;
    font-size: 16px;
  }
`;
export const Titles = styled.div`
  font-size: inherit;
  font-weight: inherit;
`;
export const Contents = styled.div`
  width: min(920px, calc(100% - 32px));
  margin: 0 auto;
`;
export const ContentMain1 = styled.section`
  position: relative;
  margin: 24px 0;
  min-height: 410px;
  overflow: hidden;
  border-radius: 30px;
  background: #2a1912;
  box-shadow: 0 20px 55px rgba(54, 30, 17, 0.2);
  img {
    position: absolute;
    inset: 0;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    opacity: 0.58;
  }
  .hero-copy {
    position: absolute;
    left: clamp(22px, 5vw, 48px);
    bottom: clamp(24px, 5vw, 48px);
    z-index: 2;
    color: #fff;
  }
  .hero-copy span {
    color: #ffd2ae;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .hero-copy h1 {
    max-width: 520px;
    margin: 8px 0;
    font-size: clamp(32px, 7vw, 58px);
    line-height: 1;
    letter-spacing: -0.055em;
  }
  .hero-copy p {
    margin: 0;
    color: #ead9cf;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    min-height: 330px;
    margin: 16px 0;
    border-radius: 22px;
  }

  @media (max-width: 420px) {
    min-height: 280px;

    .hero-copy h1 {
      font-size: 30px;
    }

    .hero-copy p {
      padding-right: 16px;
      font-size: 13px;
    }
  }
`;
export const Promo = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 22px;
  align-items: center;
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #eee1d8;
  box-shadow: 0 12px 35px rgba(60, 34, 20, 0.07);
  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: 18px;
  }
  .eyebrow {
    color: #d96b2b;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.1em;
  }
  .discount {
    margin: 8px 0;
    font-size: 28px;
    font-weight: 900;
    line-height: 1.1;
  }
  .description {
    color: #8c7365;
    line-height: 1.6;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 18px;
    border-radius: 20px;

    img {
      height: 160px;
    }
  }
`;
export const Cartd = styled.button`
  width: 100%;
  height: 56px;
  margin-top: 20px;
  border: 0;
  border-radius: 17px;
  background: #d96b2b;
  color: #fff;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(217, 107, 43, 0.25);
  &:hover {
    background: #b9501f;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #bda99d;
    box-shadow: none;
    cursor: wait;
    transform: none;
  }
`;
export const GuestForm = styled.section`
  display: grid;
  grid-template-columns: 1fr minmax(320px, 0.8fr);
  gap: 32px;
  align-items: center;
  margin-top: 20px;
  padding: 24px 30px;
  border: 1px solid #463128;
  border-radius: 24px;
  background: #2a1912;
  color: #fff;
  box-shadow: 0 14px 36px rgba(54, 30, 17, 0.14);
  span {
    display: block;
    color: #f4a66f;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  strong {
    display: block;
    margin: 5px 0;
    font-size: 22px;
  }
  small {
    display: block;
    color: #d6c5bb;
    line-height: 1.5;
  }
  .ant-input-affix-wrapper {
    display: flex;
    align-items: center;
    height: 52px;
    padding: 0 16px;
    border: 1px solid rgba(217, 107, 43, 0.18);
    border-radius: 15px;
    background: #fff;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
  }
  .ant-input-prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 11px;
    color: #d96b2b;
    font-size: 17px;
    line-height: 1;
  }
  .ant-input {
    height: auto;
    padding: 0 !important;
    background: transparent;
    font-size: 15px;
    line-height: 1.4;
  }
  .ant-input::placeholder {
    color: #a99c95;
  }
  .ant-input-affix-wrapper-focused {
    border-color: #e78043;
    box-shadow: 0 0 0 3px rgba(217, 107, 43, 0.16);
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 20px;
    .ant-input-affix-wrapper {
      height: 50px;
    }
  }

  @media (max-width: 420px) {
    padding: 18px 16px;

    strong {
      font-size: 19px;
    }
  }
`;
export const Footer = styled.footer`
  margin-top: 30px;
  padding: 18px;
  text-align: center;
  color: #977d6e;
  font-size: 12px;
  line-height: 1.7;
`;
