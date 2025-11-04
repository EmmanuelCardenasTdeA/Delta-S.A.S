import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const noti = withReactContent(Swal);

function VentasForm({ onClose, onSuccess, sellData }) {
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stockDisponible, setStockDisponible] = useState(null);

  const [formData, setFormData] = useState({
    id_producto: "",
    id_bodega: "",
    cantidad: "",
    id_responsable: "",
    fecha: "",
  });

  // Cargar productos, bodegas y usuarios
  useEffect(() => {
    axios
      .get("http://localhost:3000/getProducts")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));

    axios
      .get("http://localhost:3000/getBodegas")
      .then((res) => setBodegas(res.data))
      .catch((err) => console.error("Error al cargar bodegas:", err));

    axios
      .get("http://localhost:3000/getUsuariosActivos")
      .then((res) => {
        const data = Array.isArray(res.data[0]) ? res.data[0] : res.data;
        setUsuarios(data);
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));

    if (sellData) {
      setFormData({
        id_producto: sellData.id_product,
        id_bodega: sellData.id_bodega,
        cantidad: sellData.lot,
        id_responsable: sellData.id_user,
        fecha: sellData.date ? sellData.date.split(".")[0] : "",
      });
    }
  }, [sellData]);

  // Obtener stock disponible al cambiar producto o bodega
  useEffect(() => {
    if (formData.id_producto && formData.id_bodega) {
      axios
        .get("http://localhost:3000/getStock", {
          params: {
            id_producto: formData.id_producto,
            id_bodega: formData.id_bodega,
          },
        })
        .then((res) => setStockDisponible(res.data.stock || 0))
        .catch(() => setStockDisponible(null));
    } else {
      setStockDisponible(null);
    }
  }, [formData.id_producto, formData.id_bodega]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { id_producto, id_bodega, cantidad, id_responsable, fecha } =
      formData;

    if (!id_producto || !id_bodega || !cantidad || !id_responsable) {
      noti.fire(
        "Campos incompletos",
        "Por favor llene todos los campos",
        "warning"
      );
      return;
    }

    if (stockDisponible !== null && parseInt(cantidad) > stockDisponible) {
      noti.fire(
        "Stock insuficiente",
        `El stock disponible es de ${stockDisponible} unidades.`,
        "error"
      );
      return;
    }

    const fechaMySQL = fecha
      ? new Date(fecha).toISOString().slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");

    if (sellData) {
      // EDITAR → PUT
      axios
        .put(`http://localhost:3000/updateSell/${sellData.id_sell}`, {
          id_product: id_producto,
          id_bodega,
          lot: cantidad,
          date: fechaMySQL,
          id_user: id_responsable,
        })
        .then(() => {
          noti.fire(
            "Venta actualizada",
            "La venta se actualizó correctamente",
            "success"
          );
          onSuccess();
        })
        .catch(() => {
          noti.fire("Error", "No se pudo actualizar la venta", "error");
        });
    } else {
      // CREAR → POST
      axios
        .post("http://localhost:3000/createSell", {
          id_product: id_producto,
          id_bodega,
          lot: cantidad,
          date: fechaMySQL,
          id_user: id_responsable,
        })
        .then(() => {
          noti.fire(
            "Venta registrada",
            "La venta se guardó correctamente",
            "success"
          );
          onSuccess();
        })
        .catch((err) => {
          console.error(err);
          noti.fire("Error", "No se pudo registrar la venta", "error");
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
          {sellData ? "Editar Venta" : "Registrar Venta"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Producto</span>
            <select
              name="id_producto"
              value={formData.id_producto}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
            >
              <option value="">Seleccione un producto</option>
              {productos.map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Bodega</span>
            <select
              name="id_bodega"
              value={formData.id_bodega}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
            >
              <option value="">Seleccione una bodega</option>
              {bodegas.map((b) => (
                <option key={b.id_bodega} value={b.id_bodega}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Cantidad</span>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="border p-2 rounded-md w-full mt-1"
              min="1"
            />
            {stockDisponible !== null && (
              <p className="text-sm text-gray-600 mt-1">
                Stock disponible: <strong>{stockDisponible}</strong> unidades
              </p>
            )}
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Responsable</span>
            <select
              name="id_responsable"
              value={String(formData.id_responsable || "")} // 🔹 Forzamos tipo string
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_responsable: e.target.value, // mantiene string
                }))
              }
              className="border p-2 rounded-md w-full mt-1"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id_documento} value={u.id_documento}>
                  {u.nombre} ({u.rol})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Fecha y Hora</span>
            <input
              type="datetime-local"
              name="fecha"
              value={formData.fecha || new Date().toISOString().slice(0, 16)}
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

export default VentasForm;
