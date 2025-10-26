import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BodegaForm from "./BodegaForm";

const noti = withReactContent(Swal);

function Bodegas() {
  const [bodegas, setBodegas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [productos, setProductos] = useState([]);
  const [activeBodega, setActiveBodega] = useState(null);

  const getBodegas = () => {
    axios.get("http://localhost:3000/getBodegas")
      .then((res) => setBodegas(res.data))
      .catch((err) => console.error(err));
  };

  const getProductos = (id_bodega) => {
    axios.get(`http://localhost:3000/getBodegaProducts/${id_bodega}`)
      .then((res) => setProductos(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getBodegas();
  }, []);

  const deleteBodega = (bodega) => {
    noti.fire({
      title: <strong>Eliminar Bodega</strong>,
      html: <i>¿Desea eliminar la bodega {bodega.nombre}?</i>,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      icon: "warning",
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`http://localhost:3000/deleteBodega/${bodega.id_bodega}`)
          .then(() => {
            getBodegas();
            setProductos([]);
            noti.fire("Bodega eliminada", "", "success");
          });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Bodegas</h1>
        <button
          onClick={() => {
            setSelectedBodega(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Añadir Bodega
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {bodegas.map((bodega) => (
          <button
            key={bodega.id_bodega}
            onClick={() => {
              setActiveBodega(bodega.id_bodega);
              getProductos(bodega.id_bodega);
            }}
            className={`px-4 py-2 rounded-md ${
              activeBodega === bodega.id_bodega ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {bodega.nombre}
          </button>
        ))}
      </div>

      {activeBodega && (
        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Productos en Bodega {bodegas.find(b => b.id_bodega === activeBodega)?.nombre}
          </h2>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 font-semibold text-gray-700">ID Producto</th>
                <th className="p-2 font-semibold text-gray-700">Nombre</th>
                <th className="p-2 font-semibold text-gray-700">Stock</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">{p.id_producto}</td>
                  <td className="p-2">{p.nombre_producto}</td>
                  <td className="p-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <BodegaForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            getBodegas();
            setShowForm(false);
          }}
          bodegaData={selectedBodega}
        />
      )}
    </div>
  );
}

export default Bodegas;
