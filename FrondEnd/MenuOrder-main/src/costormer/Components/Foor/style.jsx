import { Row } from "antd";
import styled from "styled-components";

export const WrapperFooter = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(205, 133, 63);
    align-items: center; 
    gap: 16px;
    flex-wrap: nowrap;
    position: fixed;    /* Fixed position */
    bottom: 0;          /* Stick to bottom */
    width: 100%;        /* Full width */
    z-index: 1000;
`