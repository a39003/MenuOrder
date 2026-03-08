import { Button, Table } from "antd";
import styled from "styled-components";

// Header Section
export const Headers = styled.div`
    display: flex;
    align-items: center;
    background-color: #F1EFEF;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 8px;
    justify-content: center;
    position: relative;
    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export const Titles = styled.div`
    margin-left: 50px;
    font-size: 20px;
    font-weight: bold;
    @media (max-width: 768px) {
        margin-left: 20px;
        font-size: 18px;
    }
`;


export const StatusButton = styled.div`
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 12px;
    @media (max-width: 768px) {
        font-size: 10px;
        padding: 4px 8px;
    }
`;


export const FooterButton = styled.div`
    position: fixed;
    margin-top: 16px;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 100%; 
    padding: 10px 20px;
    gap: 10px; 
    padding-left: 20px; 
    padding-right: 20px; 
    box-sizing: border-box;
    @media (max-width: 768px) {
        padding: 10px 15px;
        gap: 8px; /* Adjust gap for mobile */
    }
`;


export const ButtonStyle = styled(Button)`
    background: #E5E5E5;
    color: #000;
    font-weight: bold;
    height: 40px;
    border-radius: 20px;
    font-size: 14px;
    width: 30%; /* Make buttons equal in width */
    @media (max-width: 768px) {
        width: 30%; /* Maintain equal width on mobile */
        font-size: 12px; /* Adjust font size on smaller screens */
    }
`;


export const ButtonOrder = styled(ButtonStyle)`
`;


export const ButtonPayment = styled(ButtonStyle)`
`;


export const ButtonSupport = styled(ButtonStyle)`
`;

export const ContainerModal = styled.div`
  background: #dad1d1;
  padding: 10px;
  border-radius: 9px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 8px; 
  }
`

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center;
  }

  .ant-table-tbody > tr > td {
    text-align: center;
    padding: 8px 10px;  
  }

  @media (max-width: 768px) {
    font-size: 12px;  
    .ant-table-thead > tr > th {
      font-size: 12px;  
    }
    
    .ant-table-tbody > tr > td {
      font-size: 12px;  
      padding: 6px 8px; 
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;  
    .ant-table-thead > tr > th {
      font-size: 10px;
    }
    
    .ant-table-tbody > tr > td {
      font-size: 10px;
      padding: 4px 6px; 
    }
  }
`;
