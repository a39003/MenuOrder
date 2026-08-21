import { Button } from "antd";
import styled from "styled-components";

export const ButtonGruoup = styled(Button)`
  height: 42px; padding: 0 18px; margin: 0 5px; border: 0; border-radius: 12px;
  color: #fff; background: #d96b2b; font-weight: 700; box-shadow: 0 8px 20px rgba(217,107,43,.2);
  &:hover { color: #fff !important; background: #b9501f !important; }
`;
export const Conter = styled.main`
  min-height: calc(100vh - 72px) !important; padding: 42px 24px !important; background: #fffaf4 !important;
  h1 { margin: 0 0 20px; color: #2a1912; font-size: clamp(25px,4vw,36px); letter-spacing: -.04em; text-transform: none; }
`;
export const Tablecontainer = styled.div`
  width: min(1120px, 100%); margin: 28px auto 0; overflow-x: auto; border: 1px solid #eee4dc;
  border-radius: 20px; background: #fff; box-shadow: 0 14px 40px rgba(60,34,20,.08);
`;
