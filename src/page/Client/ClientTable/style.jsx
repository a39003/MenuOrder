
import styled from "styled-components";


export const Headers = styled.div`
    display:flex;
    align-items:center; 
    background-color: #F1EFEF;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0; 
    border-radius: 8px;
    @media (max-width: 768px) {
        padding: 10px;
  }
`

export const Titles = styled.div`
    margin-left: 50px; 
    font-size: 20px; 
    font-weight: bold;    
`

export const Contents = styled.div`
    padding: 20px;
      @media (max-width: 768px) {
    padding: 10px;
  }
`

export const ContentMain1 =styled.div`
    text-align: center; 
    margin-bottom: 20px; 
    border-radius: 25px; 
    background-color: #F1EFEF; 
`

export const Footer = styled.div`
    text-align: center;
    font-size: 12px;
    background-color: #F1EFEF;
    padding: 10px 0;
    color: #555;
      @media (max-width: 768px) {
    font-size: 12px;
  }
`

export const Cartd = styled.div`
    position: fixed;
    bottom:50px;
    right: 9px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer; 
      @media (max-width: 768px) {
    font-size: 12px;
    padding: 5px 15px;
  } 
`
