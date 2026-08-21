import React from "react"
import Header from "../Header/Header"


const Default = ({children}) => {
    return(
        <div className="admin-shell">          
            <Header/>
            <main className="admin-content">{children}</main>
        </div>
    )
}

export default Default
