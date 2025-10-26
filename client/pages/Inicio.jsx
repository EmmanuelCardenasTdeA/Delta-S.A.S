import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Inicio() {
  const [ventasPorProducto, setVentasPorProducto] = useState([]);
  const [ventasPorBodega, setVentasPorBodega] = useState([]);
  const [ventasPorUsuario, setVentasPorUsuario] = useState([]);

  useEffect(() => {
    // Ventas por producto
    axios.get("http://localhost:3000/getVentasPorProducto")
      .then(res => setVentasPorProducto(res.data))
      .catch(err => console.error("Error ventas por producto:", err));

    // Ventas por bodega
    axios.get("http://localhost:3000/getVentasPorBodega")
      .then(res => setVentasPorBodega(res.data))
      .catch(err => console.error("Error ventas por bodega:", err));

    // Ventas por usuario
    axios.get("http://localhost:3000/getVentasPorUsuario")
      .then(res => setVentasPorUsuario(res.data))
      .catch(err => console.error("Error ventas por usuario:", err));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Ventas</h1>

      {/* Gráfica por producto */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Ventas por Producto</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ventasPorProducto} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_producto" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica por bodega */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Ventas por Bodega</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ventasPorBodega} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_bodega" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica por usuario */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Ventas por Usuario</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ventasPorUsuario} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_usuario" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Inicio;
