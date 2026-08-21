import styled from "styled-components";

export const WrapperHeader = styled.header`
  height: 72px;
  padding: 0 max(24px, calc((100vw - 1180px) / 2));
  display: flex;
  align-items: center;
  gap: 18px;
  position: sticky;
  top: 0;
  z-index: 100;
  color: #fff;
  background: rgba(38, 24, 18, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 8px 26px rgba(36, 21, 15, .14);
`;

export const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-right: auto;
  padding: 0;
  border: 0;
  color: #fff;
  background: transparent;
  cursor: pointer;
  div { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; background: linear-gradient(135deg,#f28a43,#c95725); font-size: 19px; }
  strong { font-size: 17px; letter-spacing: -.02em; }
  span { display: block; color: #bfaea4; font-size: 10px; text-align: left; text-transform: uppercase; letter-spacing: .09em; }
`;

export const WrapperMenu = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: #fff;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 13px;
  background: rgba(255,255,255,.07);
  cursor: pointer;
  &:hover { background: rgba(255,255,255,.13); }
`;

export const WrapperContentPopup = styled.button`
  width: 100%;
  min-width: 190px;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #4e3a2f;
  cursor: pointer;
  &:hover { color: #c75c27; background: #fff5ec; }
`;

export const DesktopNav = styled.nav`
  display: flex;
  gap: 5px;
  button { height: 42px; padding: 0 13px; display:flex; align-items:center; gap:7px; border:0; border-radius:12px; color:#d9cbc3; background:transparent; cursor:pointer; font-weight:700; font-size:13px; }
  button:hover, button.active { color:#fff; background:rgba(255,255,255,.1); }
  button.active { box-shadow: inset 0 -2px #f28a43; }
  @media (max-width: 860px) { display:none; }
`;

export const WrapperOrder = styled.button`
  height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #fff;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 13px;
  background: rgba(255,255,255,.07);
  cursor: pointer;
  &:hover { border-color: #e88448; color: #ffb27d; }
  @media (max-width: 560px) { span { display: none; } }
`;
