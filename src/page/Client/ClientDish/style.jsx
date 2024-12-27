import styled from "styled-components";

export const Headers = styled.div`
  display: flex;
  align-items: center; 
  background-color: #F1EFEF;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0; 
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 15px;  
  }

  @media (max-width: 480px) {
    padding: 10px;  
  }
`;

export const Titles = styled.div`
  margin-left: 50px; 
  font-size: 20px; 
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 18px;  
    margin-left: 20px; 
  }

  @media (max-width: 480px) {
    font-size: 16px;  
    margin-left: 10px; 
  }
`;

export const Cart = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 35px;   
    height: 35px;  
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    width: 30px;  
    height: 30px;
    top: 10px;
    right: 10px;
  }
`;

export const Dishlist = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto; 
  gap: 15px; 
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  flex: 0 0 auto; 
  width: 150px;
  height: 200px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;

  @media (max-width: 768px) {
    width: 130px;   
    height: 180px;  
    padding: 8px;   
  }

  @media (max-width: 480px) {
    width: 110px;   
    height: 160px;  
    padding: 6px;   
  }
`;
