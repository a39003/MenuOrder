import { Input } from "antd";
import React from "react";
import { InputStyle } from "./style";


const Inputd = (props) => {
    const {placeholder = 'Nhập text', ...rests} = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    return(
        <InputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput}/>
    )
}

export default Inputd