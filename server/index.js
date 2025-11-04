const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventariodeltav2",
});

// ============================
// CRUD USUARIOS
// ============================
app.post("/createUser", (req, res) => {
  const { id_document, name, lastName, rol } = req.body;

  db.query(
    "CALL createUser(?, ?, ?, ?)",
    [id_document, name, lastName, rol],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al registrar el empleado");
      } else {
        res.send("Empleado registrado correctamente");
      }
    }
  );
});

app.get("/getUser", (req, res) => {
  db.query("CALL getUsers()", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener usuarios");
    } else {
      res.send(result[0]);
    }
  });
});

app.put("/updateUser", (req, res) => {
  const { old_id_document, id_document, name, lastName, rol } = req.body;

  db.query(
    "CALL updateUser(?, ?, ?, ?, ?)",
    [old_id_document, id_document, name, lastName, rol],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el empleado");
      } else {
        res.send("Empleado actualizado correctamente");
      }
    }
  );
});

app.delete("/deleteUser/:id_document", (req, res) => {
  const { id_document } = req.params;

  db.query("CALL deleteUser(?)", [id_document], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al eliminar el empleado");
    } else {
      res.send("Empleado eliminado correctamente");
    }
  });
});

app.get("/getUsuariosActivos", (req, res) => {
  db.query("CALL getUsuariosActivos()", (err, result) => {
    if (err) {
      console.error("Error al obtener usuarios activos:", err);
      return res.status(500).send("Error al obtener usuarios activos");
    }
    res.send(result[0]);
  });
});

// ============================
// CRUD PRODUCTOS
// ============================
app.post("/createProduct", (req, res) => {
  const { nombre, material, detalle } = req.body;
  db.query(
    "CALL createProduct(?, ?, ?)",
    [nombre, material, detalle],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al registrar producto");
      } else {
        res.send("Producto registrado correctamente");
      }
    }
  );
});

app.get("/getProducts", (req, res) => {
  db.query("CALL getProducts()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.put("/updateProduct/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const { nombre, material, detalle } = req.body;
  db.query(
    "CALL updateProduct(?, ?, ?, ?)",
    [id_producto, nombre, material, detalle],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Producto actualizado correctamente");
    }
  );
});

app.delete("/deleteProduct/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  db.query("CALL deleteProduct(?)", [id_producto], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Producto eliminado correctamente");
  });
});

// ============================
// CRUD BODEGAS
// ============================
app.post("/createBodega", (req, res) => {
  const { nombre } = req.body;
  db.query("CALL createBodega(?)", [nombre], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Bodega registrada correctamente");
  });
});

app.get("/getBodegas", (req, res) => {
  db.query("CALL getBodegas()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.put("/updateBodega/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;
  const { nombre } = req.body;
  db.query("CALL updateBodega(?, ?)", [id_bodega, nombre], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Bodega actualizada correctamente");
  });
});

app.delete("/deleteBodega/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;
  db.query("CALL deleteBodega(?)", [id_bodega], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Bodega eliminada correctamente");
  });
});

app.get("/getBodegaProducts/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;

  db.query("CALL getBodegaProducts(?)", [id_bodega], (err, result) => {
    if (err) {
      console.error("Error al obtener productos de la bodega:", err);
      return res.status(500).send(err);
    }
    res.send(result[0]);
  });
});

// ============================
// ADMINISTRACIÓN DE VENTAS
// ============================

app.get("/getSells", (req, res) => {
  db.query("CALL getSells()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.post("/createSell", (req, res) => {
  const { id_product, id_bodega, lot, date, id_user } = req.body;
  db.query(
    "CALL createSell(?, ?, ?, ?, ?)",
    [id_product, id_bodega, lot, date, id_user],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err.sqlMessage || "Error al registrar la venta");
      } else {
        res.send("Venta registrada y stock actualizado correctamente");
      }
    }
  );
});

app.put("/updateSell/:id_sell", (req, res) => {
  const { id_sell } = req.params;
  const { id_product, id_bodega, lot, date, id_user } = req.body;
  db.query(
    "CALL updateSell(?, ?, ?, ?, ?, ?)",
    [id_sell, id_product, id_bodega, lot, date, id_user],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Venta actualizada correctamente");
    }
  );
});

app.put("/updateSellStatus/:id_sell", (req, res) => {
  const { id_sell } = req.params;
  const { status } = req.body;
  db.query("CALL updateSellStatus(?, ?)", [id_sell, status], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Estado de venta actualizado correctamente");
  });
});

// ============================
// REPORTES Y ESTADÍSTICAS
// ============================

app.get("/getVentasPorProducto", (req, res) => {
  db.query("CALL getVentasPorProducto()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.get("/getVentasPorBodega", (req, res) => {
  db.query("CALL getVentasPorBodega()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.get("/getVentasPorUsuario", (req, res) => {
  db.query("CALL getVentasPorUsuario()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

app.get("/getVentasPorDia", (req, res) => {
  db.query("CALL getVentasPorDia()", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result[0]);
  });
});

// =============================================
// AGREGAR PRODUCTOS A BODEGAS (STOCK / INVENTARIO)
// =============================================
app.post("/addProductToBodega", (req, res) => {
  const { id_bodega, id_producto, cantidad } = req.body;

  // Validar datos
  if (!id_bodega || !id_producto || !cantidad) {
    return res
      .status(400)
      .send("Faltan datos: id_bodega, id_producto o cantidad");
  }

  const sql = "CALL addProductToBodega(?, ?, ?)";

  db.query(sql, [id_bodega, id_producto, cantidad], (err, result) => {
    if (err) {
      console.error("❌ Error al agregar producto a bodega:", err);
      return res
        .status(500)
        .send("Error al actualizar el inventario de la bodega");
    }

    res.send("✅ Producto agregado o actualizado correctamente en la bodega");
  });
});

// =============================================
// BUSCAR USUARIOS
// =============================================
app.get("/searchUsuario/:term", (req, res) => {
  const { term } = req.params;
  db.query("CALL searchUsuario(?)", [term], (err, result) => {
    if (err) {
      console.error("❌ Error al buscar usuario:", err);
      return res.status(500).send("Error al buscar usuario");
    }
    res.send(result[0]); // los procedimientos devuelven [[rows]]
  });
});

// =============================================
// BUSCAR BODEGAS
// =============================================
app.get("/searchBodega/:term", (req, res) => {
  const { term } = req.params;
  db.query("CALL searchBodega(?)", [term], (err, result) => {
    if (err) {
      console.error("❌ Error al buscar bodega:", err);
      return res.status(500).send("Error al buscar bodega");
    }
    res.send(result[0]);
  });
});

// =============================================
// BUSCAR PRODUCTOS
// =============================================
app.get("/searchProducto/:term", (req, res) => {
  const { term } = req.params;
  db.query("CALL searchProducto(?)", [term], (err, result) => {
    if (err) {
      console.error("❌ Error al buscar producto:", err);
      return res.status(500).send("Error al buscar producto");
    }
    res.send(result[0]);
  });
});

// =============================================
// BUSCAR VENTAS
// =============================================
app.get("/searchVenta/:term", (req, res) => {
  const { term } = req.params;

  db.query("CALL searchVenta(?)", [term], (err, result) => {
    if (err) {
      console.error("❌ Error al buscar ventas:", err);
      return res.status(500).send("Error al buscar ventas");
    }
    res.send(result[0]); // Los procedimientos almacenados devuelven un array doble [[...]]
  });
});

// ============================
// SERVER START
// ============================

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
