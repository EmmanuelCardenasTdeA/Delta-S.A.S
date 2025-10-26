import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UsuarioForm from "./UsuarioForm";

const noti = withReactContent(Swal);

function Usuarios() {
  const [userList, setUserList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // para editar

  const getUser = () => {
    axios.get("http://localhost:3000/getUser").then((response) => {
      setUserList(response.data);
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const deleteUser = (val) => {
    noti
      .fire({
        title: <strong>Eliminar Usuario</strong>,
        html: <i><strong>¿Realmente desea eliminar a {val.nombre}?</strong></i>,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        icon: "warning",
      })
      .then((res) => {
        if (res.isConfirmed) {
          axios.delete(`http://localhost:3000/deleteUser/${val.id_documento}`).then(() => {
            getUser();
          });
          noti.fire({
            title: <strong>Usuario Eliminado!</strong>,
            html: <i>Usuario eliminado con éxito</i>,
            icon: "success",
          });
        }
      });
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Añadir Usuario
        </button>
      </div>

      {/* Lista de usuarios */}
      <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-700">ID</th>
              <th className="p-3 font-semibold text-gray-700">Nombre</th>
              <th className="p-3 font-semibold text-gray-700">Apellido</th>
              <th className="p-3 font-semibold text-gray-700">Rol</th>
              <th className="p-3 font-semibold text-gray-700 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((val, key) => (
              <tr key={key} className="border-b hover:bg-gray-50">
                <td className="p-3">{val.id_documento}</td>
                <td className="p-3">{val.nombre}</td>
                <td className="p-3">{val.apellido}</td>
                <td className="p-3">{val.rol}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedUser(val);
                      setShowForm(true);
                    }}
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-700 mx-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteUser(val)}
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
        <UsuarioForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            getUser();
            setShowForm(false);
          }}
          userData={selectedUser}
        />
      )}
    </div>
  );
}

export default Usuarios;
