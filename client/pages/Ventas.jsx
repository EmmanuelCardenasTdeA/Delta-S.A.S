import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import VentasForm from "./VentasForm";

const noti = withReactContent(Swal);

function Ventas() {
  const [ventasList, setVentasList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  const getVentas = () => {
    axios
      .get("http://localhost:3000/getSells")
      .then((response) => {
        setVentasList(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getVentas();
  }, []);

  const cancelarVenta = (venta) => {
    noti
      .fire({
        title: <strong>Cancelar Venta</strong>,
        html: (
          <i>
            <strong>
              ¿Desea cancelar la venta #{venta.id_sell}? Esta acción no la
              eliminará, solo cambiará su estado a "Cancelada".
            </strong>
          </i>
        ),
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
        icon: "warning",
      })
      .then((res) => {
        if (res.isConfirmed) {
          axios
            .put(`http://localhost:3000/updateSellStatus/${venta.id_sell}`, {
              status: "Cancelada",
            })
            .then(() => {
              getVentas();
              noti.fire({
                title: <strong>Venta Cancelada</strong>,
                html: <i>La venta fue marcada como cancelada</i>,
                icon: "success",
              });
            })
            .catch((error) => {
              console.error(error);
              noti.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cancelar la venta.",
              });
            });
        }
      });
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
        <button
          onClick={() => {
            setSelectedVenta(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Añadir Venta
        </button>
      </div>

      {/* Lista de Ventas */}
      <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-700">ID Venta</th>
              <th className="p-3 font-semibold text-gray-700">Producto</th>
              <th className="p-3 font-semibold text-gray-700">Bodega</th>
              <th className="p-3 font-semibold text-gray-700">Cantidad</th>
              <th className="p-3 font-semibold text-gray-700">Fecha</th>
              <th className="p-3 font-semibold text-gray-700">Usuario</th>
              <th className="p-3 font-semibold text-gray-700">Estado</th>
              <th className="p-3 font-semibold text-gray-700 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {ventasList.map((venta, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{venta.id_sell}</td>
                <td className="p-3">{venta.nombre_producto}</td>
                <td className="p-3">{venta.nombre_bodega}</td>
                <td className="p-3">{venta.lot}</td>
                <td className="p-3">
                  {new Date(venta.date).toLocaleString("es-ES")}
                </td>
                <td className="p-3">{venta.nombre_usuario}</td>
                <td
                  className={`p-3 font-semibold ${
                    venta.status === "Activo"
                      ? "text-green-600"
                      : venta.status === "Cancelada"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {venta.status}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedVenta(venta);
                      setShowForm(true);
                    }}
                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-700 mx-1"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => cancelarVenta(venta)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 mx-1"
                    disabled={venta.status === "Cancelada"}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <VentasForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            getVentas();
            setShowForm(false);
          }}
          sellData={selectedVenta}
        />
      )}
    </div>
  );
}

export default Ventas;
