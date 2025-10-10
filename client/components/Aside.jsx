import React from 'react'
import { Link } from 'react-router-dom'

function Aside() {
  return (
    <>
        <aside>
            <h2><Link to="/">Inicio</Link></h2>
            <h2><Link to="/bodegas">Bodegas</Link></h2>
            <h2><Link to="/inventario">Inventario</Link></h2>
            <h2><Link to="/ventas">Ventas</Link></h2>
            <h2><Link to="/user">Usuarios</Link></h2>
        </aside>
    </>
  )
}

export default Aside