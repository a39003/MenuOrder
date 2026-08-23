import styled from "styled-components";
export const LoginPage = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: #fffaf4;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
export const LoginVisual = styled.section`
  min-height: 100vh;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #fff;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(242, 138, 67, 0.35),
      transparent 32%
    ),
    linear-gradient(140deg, #251711, #63341f 62%, #c35e28);
  h1 {
    max-width: 570px;
    margin: 0;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 1.02;
    letter-spacing: -0.06em;
  }
  p {
    max-width: 500px;
    margin: 20px 0 0;
    color: #e8d7cd;
    font-size: 16px;
    line-height: 1.7;
  }
  @media (max-width: 800px) {
    min-height: 280px;
    padding: 38px 26px;
    h1 {
      font-size: 38px;
    }
  }
`;
export const LoginContainer = styled.section`
  display: grid;
  place-items: center;
  padding: 34px;
`;
export const LoginCar = styled.div`
  width: min(390px, 100%);
  padding: 38px;
  border: 1px solid #eee1d8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(60, 34, 20, 0.1);
  .logo {
    width: 58px;
    height: 58px;
    object-fit: cover;
    border-radius: 16px;
  }
  h2 {
    margin: 20px 0 5px;
    font-size: 28px;
    letter-spacing: -0.04em;
  }
  .subtitle {
    margin: 0 0 26px;
    color: #907568;
    font-size: 14px;
  }
  .ant-input,
  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 13px;
    margin-bottom: 13px;
  }
  .login-button {
    width: 100%;
    height: 48px;
    margin-top: 10px;
    border: 0;
    border-radius: 13px;
    background: #d96b2b;
    color: #fff;
    font-weight: 800;
    cursor: pointer;
  }
  .login-button:hover {
    background: #b9501f;
  }
`;
