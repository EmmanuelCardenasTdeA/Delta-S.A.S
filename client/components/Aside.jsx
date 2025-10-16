import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {Home, Warehouse, Package, ShoppingCartIcon , Users, LogOut} from 'lucide-react'

function Aside() {
  const location = useLocation()

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const linkClass = (path) =>
    `block px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === path  ? 'bg-gray-700 text-white': 'hover:bg-gray-800 text-gray-300'}`

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Delta S.A.S
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={`${linkClass('/')} flex items-center gap-3`}> <Home size={20} className={location.pathname === "/" ? "text-orange-500" : "text-gray-400"}/> Inicio</Link>
        <Link to="/bodegas" className={`${linkClass('/bodegas')} flex items-center gap-3`}><Warehouse size={20} className={location.pathname === "/bodegas" ? "text-orange-500" : "text-gray-400"}/>Bodegas</Link>
        <Link to="/inventario" className={`${linkClass('/inventario')} flex items-center gap-3`}><Package size={20} className={location.pathname === "/inventario" ? "text-orange-500" : "text-gray-400"}/>Inventario</Link>
        <Link to="/ventas" className={`${linkClass('/ventas')} flex items-center gap-3`}><ShoppingCartIcon size={20} className={location.pathname === "/ventas" ? "text-orange-500" : "text-gray-400"}/>Ventas</Link>
        <Link to="/user" className={`${linkClass('/user')} flex items-center gap-3`}><Users size={20} className={location.pathname === "/user" ? "text-orange-500" : "text-gray-400"}/>Usuarios</Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md hover:bg-red-600 transition-colors duration-200">
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Aside
