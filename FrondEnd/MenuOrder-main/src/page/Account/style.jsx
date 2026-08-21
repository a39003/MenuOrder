import styled from "styled-components";
export const MainContent = styled.main`min-height:calc(100vh - 72px);padding:52px 24px;display:grid;place-items:start center;background:#fffaf4;`;
export const ProfileContainer = styled.section`
  width:min(520px,100%);padding:36px;text-align:center;border:1px solid #eee1d8;border-radius:28px;background:#fff;box-shadow:0 18px 50px rgba(60,34,20,.09);
  .ant-avatar{background:linear-gradient(135deg,#ef8947,#bd4e20);box-shadow:0 10px 24px rgba(217,107,43,.25)}
  h2{margin:18px 0 4px;font-size:26px}.role{margin:0 0 28px;color:#9a7d6c}
  .profile-row{text-align:left;margin:12px 0;padding:15px;border-radius:14px;background:#faf5f1}.profile-row span{display:block;color:#9a7d6c;font-size:11px;text-transform:uppercase;letter-spacing:.07em}.profile-row strong{display:block;margin-top:4px;font-size:15px}
  .logout{width:100%;height:46px;margin-top:18px;border:1px solid #ead7cb;border-radius:13px;background:#fff;color:#b34d25;font-weight:800;cursor:pointer}
`;
export const Info = styled.div``;
