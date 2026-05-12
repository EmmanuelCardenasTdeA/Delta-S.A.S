import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
//Rutas
function PrivateRoutes() {
    const isAuth = localStorage.getItem("auth") === "true"
    return isAuth ? <Outlet/> : <Navigate to="login"/>
    
  
}

export default PrivateRoutes