import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  padding-bottom: 110px;
  background:
    radial-gradient(circle at top right, rgba(255, 183, 77, 0.2), transparent 34%),
    #fffaf4;
  color: #251b16;
`;

export const Shell = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
`;

export const Headers = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 14px 0;
  background: rgba(255, 250, 244, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(74, 46, 31, 0.08);
`;

export const HeaderInner = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(74, 46, 31, 0.1);
  border-radius: 14px;
  background: #fff;
  color: #2e211b;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(60, 34, 20, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(60, 34, 20, 0.12); }
`;

export const Titles = styled.div`
  text-align: center;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;

  span { display: block; margin-top: 3px; color: #9a7c6a; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
`;

export const Hero = styled.section`
  margin: 24px 0 18px;
  padding: 28px;
  overflow: hidden;
  position: relative;
  border-radius: 28px;
  color: #fff;
  background: linear-gradient(125deg, #2a1912 0%, #6f3821 62%, #c9672d 100%);
  box-shadow: 0 18px 50px rgba(82, 42, 21, 0.2);

  &::after {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    right: -70px;
    top: -90px;
    border-radius: 50%;
    border: 38px solid rgba(255, 255, 255, 0.08);
  }

  p { margin: 0 0 8px; color: #ffd7b4; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
  h1 { max-width: 520px; margin: 0; font-size: clamp(25px, 5vw, 42px); line-height: 1.12; letter-spacing: -0.04em; }
  small { display: block; margin-top: 12px; color: rgba(255,255,255,.72); font-size: 14px; }
`;

export const SearchBox = styled.div`
  margin: 18px 0;
  .ant-input-affix-wrapper {
    height: 52px;
    padding: 0 18px;
    border: 1px solid rgba(74, 46, 31, 0.09);
    border-radius: 17px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(60, 34, 20, 0.07);
  }
  .ant-input { font-size: 15px; }
`;

export const Categories = styled.div`
  display: flex;
  gap: 10px;
  padding: 4px 0 18px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

export const CategoryButton = styled.button`
  flex: 0 0 auto;
  padding: 10px 17px;
  border: 1px solid ${({ $active }) => ($active ? "#d96b2b" : "rgba(74,46,31,.1)")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#d96b2b" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#5f4a3e")};
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? "0 8px 20px rgba(217,107,43,.25)" : "none")};
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin: 5px 0 14px;
  h2 { margin: 0; font-size: 21px; }
  span { color: #957b6b; font-size: 13px; }
`;

export const DishGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 650px) { grid-template-columns: 1fr; gap: 13px; }
`;

export const DishCard = styled.article`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  min-height: 150px;
  overflow: hidden;
  border: 1px solid rgba(74, 46, 31, 0.08);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 10px 32px rgba(60, 34, 20, 0.07);
  transition: transform .22s ease, box-shadow .22s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 16px 38px rgba(60, 34, 20,.12); }

  @media (max-width: 420px) { grid-template-columns: 116px minmax(0, 1fr); min-height: 132px; }
`;

export const DishImage = styled.div`
  position: relative;
  min-height: 100%;
  background: #f2e8df;
  img { width: 100%; height: 100%; position: absolute; inset: 0; object-fit: cover; }
  span { position: absolute; top: 10px; left: 10px; padding: 5px 9px; border-radius: 999px; background: rgba(38,25,18,.78); color: #fff; font-size: 10px; font-weight: 700; backdrop-filter: blur(5px); }
`;

export const DishInfo = styled.div`
  min-width: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  h3 { margin: 0 0 5px; font-size: 16px; line-height: 1.35; }
  p { margin: 0; color: #9a7c6a; font-size: 12px; line-height: 1.5; }
`;

export const DishBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  strong { color: #d45f24; font-size: 16px; }
  button { width: 38px; height: 38px; border: 0; border-radius: 12px; background: #2a1912; color: #fff; cursor: pointer; transition: .2s ease; }
  button:hover { background: #d96b2b; transform: scale(1.05); }
  button:disabled { background: #eee5df; color: #a99588; cursor: not-allowed; transform: none; }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 52px 20px;
  text-align: center;
  border: 1px dashed #d8c7bb;
  border-radius: 22px;
  color: #8c7567;
  background: rgba(255,255,255,.6);
`;

export const Cart = styled.button`
  position: fixed;
  z-index: 30;
  right: max(20px, calc((100vw - 1120px) / 2));
  bottom: 24px;
  width: 58px;
  height: 58px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 18px;
  background: #2a1912;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 35px rgba(42,25,18,.3);
  .ant-badge-count { background: #f07835; box-shadow: 0 0 0 2px #2a1912; }
  @media (max-width: 650px) { right: 16px; bottom: 16px; }
`;

export const ModalContent = styled.div`
  .dish-modal-image { width: 100%; height: 220px; object-fit: cover; border-radius: 18px; margin-bottom: 18px; }
  .quantity-row { display: flex; align-items: center; gap: 12px; }
  .quantity-row button { width: 38px; height: 38px; border-radius: 11px; }
  .quantity-value { width: 48px; text-align: center; font-size: 17px; font-weight: 800; }
`;
