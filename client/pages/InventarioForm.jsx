import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const noti = withReactContent(Swal);

function InventarioForm({ onClose, onSuccess, productData }) {
  const [formData, setFormData] = useState({
    nombre: "",
    material: "",
    detalle: "",
  });

  useEffect(() => {
    if (productData) {
      setFormData({
        nombre: productData.nombre,
        material: productData.material,
        detalle: productData.detalle,
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, material, detalle } = formData;

    if (!nombre || !material || !detalle) {
      noti.fire("Campos incompletos", "Por favor llene todos los campos", "warning");
      return;
    }

    if (productData) {
      // EDITAR
      axios
        .put(`http://localhost:3000/updateProduct/${productData.id_producto}`, formData)
        .then(() => {
          noti.fire("Producto actualizado", "El producto se actualizó correctamente", "success");
          onSuccess();
        })
        .catch(() => {
          noti.fire("Error", "No se pudo actualizar el producto", "error");
        });
    } else {
      // CREAR
      axios
        .post("http://localhost:3000/createProduct", formData)
        .then(() => {
          noti.fire("Producto registrado", "El producto se guardó correctamente", "success");
          onSuccess();
        })
        .catch(() => {
          noti.fire("Error", "No se pudo registrar el producto", "error");
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[430px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {productData ? "Editar Producto" : "Registrar Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Nombre</span>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Material</span>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Detalle</span>
            <input
              type="text"
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
            />
          </label>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventarioForm;
