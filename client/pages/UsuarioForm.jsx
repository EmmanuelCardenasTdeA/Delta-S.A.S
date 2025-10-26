import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const noti = withReactContent(Swal);

function UsuarioForm({ onClose, onSuccess, userData }) {
  const [id_document, setId_document] = useState("");
  const [name, setNombre] = useState("");
  const [lastName, setApellido] = useState("");
  const [rol, setRol] = useState("");
  const [old_id_document, setOld_id_document] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (userData) {
      setId_document(userData.id_documento);
      setNombre(userData.nombre);
      setApellido(userData.apellido);
      setRol(userData.rol);
      setOld_id_document(userData.id_documento);
      setUpdate(true);
    }
  }, [userData]);

  const clearData = () => {
    setId_document("");
    setNombre("");
    setApellido("");
    setRol("");
    setOld_id_document(null);
  };

  const handleSubmit = () => {
    if (!id_document || !name || !lastName || !rol) {
      noti.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos antes de registrar.",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    if (update) {
      axios
        .put("http://localhost:3000/updateUser", {
          old_id_document,
          id_document,
          name,
          lastName,
          rol,
        })
        .then(() => {
          noti.fire({
            title: <strong>Actualización Exitosa!</strong>,
            html: <i>El usuario {name} fue actualizado con éxito</i>,
            icon: "success",
          });
          onSuccess();
          clearData();
        });
    } else {
      axios
        .post("http://localhost:3000/createUser", {
          id_document,
          name,
          lastName,
          rol,
        })
        .then(() => {
          noti.fire({
            title: <strong>Registro Exitoso!</strong>,
            html: <i>El usuario {name} fue registrado con éxito</i>,
            icon: "success",
          });
          onSuccess();
          clearData();
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {update ? "Editar Usuario" : "Registrar Usuario"}
        </h2>

        <label className="block mb-2">
          ID:
          <input
            className="border p-2 rounded-md w-full"
            type="number"
            value={id_document}
            onChange={(e) => setId_document(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          Nombre:
          <input
            className="border p-2 rounded-md w-full"
            type="text"
            value={name}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          Apellido:
          <input
            className="border p-2 rounded-md w-full"
            type="text"
            value={lastName}
            onChange={(e) => setApellido(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          Rol:
          <input
            className="border p-2 rounded-md w-full"
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
        </label>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className={`${
              update ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-md`}
          >
            {update ? "Actualizar" : "Registrar"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsuarioForm;
