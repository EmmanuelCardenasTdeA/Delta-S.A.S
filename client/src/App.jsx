import Usuarios from '../pages/usuarios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Layout/Dashboard';
import Login from '../pages/Login';
import PrivateRoutes from '../routes/PrivateRoutes';
import Bodegas from '../pages/Bodegas';
import Inventario from '../pages/Inventario';
import Ventas from '../pages/Ventas';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          
          <Route element={<PrivateRoutes/>}>
            <Route path='/' element={<Dashboard/>}>
            <Route path='/bodegas' element={<Bodegas/>}></Route>
            <Route path='/inventario' element={<Inventario/>}></Route>
            <Route path='/ventas' element={<Ventas/>}></Route>
            <Route path='/user' element={<Usuarios/>}></Route>
            </Route>
          </Route>
          </Routes>
      </Router>      
    </>
  )
}

export default App
