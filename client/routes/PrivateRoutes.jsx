import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
function PrivateRoutes() {
    const isAuth = localStorage.getItem("auth") === "true"
    return isAuth ? <Outlet/> : <Navigate to="login"/>
    
  
}

export default PrivateRoutes