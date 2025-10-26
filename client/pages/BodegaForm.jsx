import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const noti = withReactContent(Swal);

function BodegaForm({ onClose, onSuccess, bodegaData }) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (bodegaData) {
      setNombre(bodegaData.nombre);
    }
  }, [bodegaData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre) {
      noti.fire("Campo incompleto", "Debe ingresar un nombre", "warning");
      return;
    }

    if (bodegaData) {
      axios
        .put(`http://localhost:3000/updateBodega/${bodegaData.id_bodega}`, { nombre })
        .then(() => {
          noti.fire("Bodega actualizada", "", "success");
          onSuccess();
        })
        .catch(() => noti.fire("Error", "No se pudo actualizar la bodega", "error"));
    } else {
      axios
        .post("http://localhost:3000/createBodega", { nombre })
        .then(() => {
          noti.fire("Bodega registrada", "", "success");
          onSuccess();
        })
        .catch(() => noti.fire("Error", "No se pudo registrar la bodega", "error"));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">
          {bodegaData ? "Editar Bodega" : "Registrar Bodega"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Nombre Bodega</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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

export default BodegaForm;
