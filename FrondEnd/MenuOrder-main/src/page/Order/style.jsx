import { Button } from "antd";
import styled from "styled-components";

export const Tables = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
`

export const TableCar = styled.div`
    background-color: #dcbba7;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #3d2b1f;
    width: 240px;
`
export const TableHeader = styled.div`
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
`

export const Status = styled.span`
    background-color: #7d4c41;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
`

export const TableBody = styled.div`
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
`

export const TimeSection = styled.div`
    font-size: 16px;
    display: flex;
    align-items: center;
`

export const DishesSection = styled.div`
    font-size: 16px;
`

export const TableFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`


export const StatusFooter = styled(Button)`
    font-size: 14px;
    background-color: #e3d0c1;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 8px;
`

export const Icons = styled.div`
    font-size: 18px;
    margin-right: 8px;
`

export const Conter = styled.div`

`

export const StatusButton = styled(Button)`
    display: block;
    margin: 10px 10px;
    padding: 10px;
    background-color: ${(props) => (props.variant === 'contained' ? '#f44336' : '#b68d6b')};
    color: black;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.3s ease; 
    &:hover {
    background-color: ${(props) => (props.variant === 'contained' ? '#e53935' : '#f0f0f0')};
    border-color: ${(props) => (props.variant === 'contained' ? '#e53935' : '#ccc')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
  }
  }
    
`


