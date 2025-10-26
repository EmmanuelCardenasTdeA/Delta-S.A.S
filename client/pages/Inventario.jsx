import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InventarioForm from "./InventarioForm";

const noti = withReactContent(Swal);

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const getProducts = () => {
    axios
      .get("http://localhost:3000/getProducts")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = (producto) => {
    noti
      .fire({
        title: <strong>Eliminar Producto</strong>,
        html: <i>¿Desea eliminar el producto {producto.nombre}?</i>,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        icon: "warning",
      })
      .then((res) => {
        if (res.isConfirmed) {
          axios
            .delete(`http://localhost:3000/deleteProduct/${producto.id_producto}`)
            .then(() => {
              getProducts();
              noti.fire("Producto eliminado", "", "success");
            });
        }
      });
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
        <button
          onClick={() => {
            setSelectedProducto(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Añadir Producto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-700">ID</th>
              <th className="p-3 font-semibold text-gray-700">Nombre</th>
              <th className="p-3 font-semibold text-gray-700">Material</th>
              <th className="p-3 font-semibold text-gray-700">Detalle</th>
              <th className="p-3 font-semibold text-gray-700 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.id_producto}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.material}</td>
                <td className="p-3">{p.detalle}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedProducto(p);
                      setShowForm(true);
                    }}
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-700 mx-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(p)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 mx-1"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <InventarioForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            getProducts();
            setShowForm(false);
          }}
          productData={selectedProducto}
        />
      )}
    </div>
  );
}

export default Inventario;
