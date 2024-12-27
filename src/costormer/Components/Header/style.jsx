import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 20px 35px;
    background-color: rgb(160, 82, 65);
    align-items: center; 
    gap: 16px;
    flex-wrap: nowrap; 
`

export const WrapperMenu = styled.div`
    display: flex;
    align-items:center; 
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        color: #e67e22;
    }
   
`


export const WrapperContentPopup = styled.p `
    cursor: pointer;
    &:hover {
        color: rgb(160, 82, 65);
    }
`


export const WrapperOrder = styled.div `
    display: flex;
    align-items:center; 
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        color: #e67e22;
    }

`