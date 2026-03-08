import { Input } from "antd";
import React from "react";


const InpuComponent = ({size, bordered, placeholder, style,value, ...rests}) => {
    return(
        <Input 
        size={size} 
        bordered={bordered} 
        placeholder={placeholder} 
        style={style}
        value={value}
        {...rests} 
    />
    )
}

export default InpuComponent