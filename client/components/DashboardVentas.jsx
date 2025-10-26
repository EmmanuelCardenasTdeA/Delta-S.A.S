import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function DashboardVentas() {
  const [ventasData, setVentasData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/getSells")
      .then((res) => {
        // Agrupa las ventas por producto
        const chartData = res.data.reduce((acc, venta) => {
          const producto = venta.nombre_producto || `ID ${venta.id_producto}`;
          const existente = acc.find(item => item.producto === producto);
          if (existente) {
            existente.cantidad += venta.lot;
          } else {
            acc.push({ producto, cantidad: venta.lot });
          }
          return acc;
        }, []);

        setVentasData(chartData);
      })
      .catch(err => console.error("Error al obtener las ventas:", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-[400px]">
      <h2 className="text-2xl font-semibold mb-4">Ventas por Producto</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ventasData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="producto" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardVentas;
