import { Button } from "antd"
import styled from "styled-components";

export const ButtonGruoup = styled(Button) `
    margin: 0 5px;
    padding: 8px 15px;
    background-color: #d35400;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #e67e22;
    }

`

export const Conter = styled.div`
`

export const Tablecontainer = styled.div`
    margin-top: 20px
    padding: 0 10px;
    width: 100%;
    max-width: 1150px;
    @media (max-width: 1024px) {
    .table-container {
        width: 90%; 
        }
    }

    @media (max-width: 768px) {
    .table-container {
        width: 100%; 
    }
    }
`