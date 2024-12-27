import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperPriceText } from "./style";


const Cardt = ({image, name, price}) => {
    return(
        <CardStyle
            hoverable
            headStyle={{width:'200px', height:'200px'}}
            style={{ width: 200 }}
            bodyStyle={{padding:'10px'}}
            cover={<img alt="example" src={image} />}>

            <StyleNameDish>{name}</StyleNameDish>
            <PriceText>
                <span style={{marginRight:'8px'}}>10.000.000 d</span>
            </PriceText>
        </CardStyle>
    )
}

export default Cardt