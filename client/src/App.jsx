import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Layout/Dashboard';
import Login from '../pages/Login';
import PrivateRoutes from '../routes/PrivateRoutes';
import Inicio from '../pages/Inicio';
import Bodegas from '../pages/Bodegas';
import Inventario from '../pages/Inventario';
import Ventas from '../pages/Ventas';
import Usuarios from '../pages/Usuarios';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Dashboard />}>
            {/* Página de inicio por defecto */}
            <Route index element={<Inicio />} />

            {/* Otras páginas */}
            <Route path="bodegas" element={<Bodegas />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="ventas" element={<Ventas />} />
            <Route path="user" element={<Usuarios />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
