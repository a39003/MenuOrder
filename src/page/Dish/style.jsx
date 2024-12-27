import { Button, Upload } from "antd"
import styled from "styled-components";

export const ButtonDish = styled(Button) `
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

export const LoadFile = styled(Upload)`
& .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
& .ant-upload-list-item-info {
    display: none
}
@ant-upload-list-item{
    display: none
}`

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