import { Button } from "antd";
import styled from "styled-components";

// 📌 Container Chính
export const Container = styled.div`
  padding: 10px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 15px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

// 📌 Danh Sách Mục
export const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 80px;
`;

// 📌 Chi Tiết Mục
export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;

  & > span {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    & > span {
      font-size: 12px;
    }
  }
`;


export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  & > button {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  & > input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    & > button {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    & > input {
      width: 70px;
      height: 45px;
    }
  }

  @media (max-width: 480px) {
    & > button {
      width: 30px;
      height: 30px;
      font-size: 14px;
    }

    & > input {
      width: 30px;
      height: 30px;
    }
  }
`;


export const RemoveButton = styled(Button)`
  color: #ff4d4f;
  font-size: 16px;
  margin-bottom: 5px;
`;


export const NoteButton = styled(Button)`
  background-color: #fce4ec;
  color: #d81b60;
  font-size: 16px;
  border-radius: 5px;
`;



export const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: 10px; 
  flex-wrap: wrap; 

  @media (max-width: 768px) {
    padding: 10px 15px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;


export const FooterButton = styled(Button)`
  height: 70px;
  border-radius: 30px;
  font-size: 20px;
  text-align: center;
  white-space: nowrap;
  flex: 1; 
  margin: 0 10px;
  width: 500px; 

  &:not(:last-child) {
    margin-right: 10px; 
  }

  @media (max-width: 1024px) {
    height: 65px;
    font-size: 18px;
    width: 300px;
  }

  @media (max-width: 768px) {
    height: 60px;
    font-size: 16px;
    width: 250px;
  }

  @media (max-width: 480px) {
    height: 55px;
    font-size: 14px;
    width: 160px;
    margin: 0 0 10px 0; /* Khoảng cách dưới các nút trên màn hình nhỏ */
  }
`;







export const Headers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f1efef;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;
  margin-right: 10px;
    border-bottom: 1px solid #f0f0f0; 
    border-radius: 8px;
  @media (max-width: 768px) {
    padding: 15px;
    margin-right: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-right: 5px;
  }
`;


export const Titles = styled.div`
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;
