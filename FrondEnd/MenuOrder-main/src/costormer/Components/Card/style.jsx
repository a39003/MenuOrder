import { Card } from "antd";
import styled from "styled-components";


export const CardStyle = styled(Card)`
    width: 200px;
    & img{
        height: 200px;
        width: 200px;
    }
`

export const StyleNameDish = styled.div`
    font-weight:400;
    font-size: 12px;
    line-height: 16px;  
    color: rgb(56,56,61);
`

export const PriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 500; 
    margin: 8px 0;
`