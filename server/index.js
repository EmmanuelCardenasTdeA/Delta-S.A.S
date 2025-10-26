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
// ADMIN USUARIOS
// ============================

app.post("/createUser", (req, res) => {
  const { id_document, name, lastName, rol } = req.body;

  db.query(
    "INSERT INTO usuario (id_documento, nombre, apellido, rol) VALUES (?,?,?,?)",
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
  db.query("SELECT * FROM usuario", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al obtener usuarios");
    } else {
      res.send(result);
    }
  });
});

app.put("/updateUser", (req, res) => {
  const { old_id_document, id_document, name, lastName, rol } = req.body;

  db.query(
    "UPDATE usuario SET id_documento = ?, nombre = ?, apellido = ?, rol = ? WHERE id_documento = ?",
    [id_document, name, lastName, rol, old_id_document],
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

  db.query("DELETE FROM usuario WHERE id_documento = ?", [id_document], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al eliminar el empleado");
    } else {
      res.send("Empleado eliminado correctamente");
    }
  });
});

app.get("/getUserById/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM usuario WHERE id_documento = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error al buscar usuario");
    } else {
      res.send(result);
    }
  });
});

// ============================
// ADMIN VENTAS
// ============================
app.get("/getSells", (req, res) => {
  const sql = `
    SELECT 
      v.id_venta AS id_sell,
      v.id_producto AS id_product,
      p.nombre AS nombre_producto,
      v.id_bodega AS id_bodega,
      b.nombre AS nombre_bodega,
      v.cantidad AS lot,
      v.Fecha AS date,
      v.id_responsable AS id_user,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_usuario,
      v.Estado AS status
    FROM venta v
    INNER JOIN producto p ON v.id_producto = p.id_producto
    INNER JOIN bodega b ON v.id_bodega = b.id_bodega
    INNER JOIN usuario u ON v.id_responsable = u.id_documento
    ORDER BY v.id_venta DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener las ventas:", err);
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});


app.post("/createSell", (req, res) => {
  const { id_product, id_bodega, lot, date, id_user } = req.body;

  // Primero verificar stock
  db.query(
    "SELECT stock FROM bodega_producto WHERE id_producto = ? AND id_bodega = ?",
    [id_product, id_bodega],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (!result.length) return res.status(400).send("No existe registro de stock para este producto.");

      const stockActual = result[0].stock;

      if (stockActual < lot) {
        return res.status(400).send("Stock insuficiente para la venta.");
      }

      // Insertar la venta
      db.query(
        "INSERT INTO venta (id_producto, id_bodega, cantidad, Fecha, id_responsable, Estado) VALUES (?, ?, ?, ?, ?, 'Activo')",
        [id_product, id_bodega, lot, date, id_user],
        (err2, result2) => {
          if (err2) return res.status(500).send(err2);

          // Actualizar stock
          const nuevoStock = stockActual - lot;
          db.query(
            "UPDATE bodega_producto SET stock = ? WHERE id_producto = ? AND id_bodega = ?",
            [nuevoStock, id_product, id_bodega],
            (err3) => {
              if (err3) return res.status(500).send(err3);
              res.send("Venta registrada y stock actualizado correctamente");
            }
          );
        }
      );
    }
  );
});

app.get("/getStock", (req, res) => {
  const { id_producto, id_bodega } = req.query;
  db.query(
    "SELECT stock FROM bodega_producto WHERE id_producto = ? AND id_bodega = ?",
    [id_producto, id_bodega],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result[0] || { stock: 0 });
    }
  );
});

app.put("/updateSell/:id_sell", (req, res) => {
  const { id_sell } = req.params;
  const { id_product, id_bodega, lot, date, id_user } = req.body;

  db.query(
    "UPDATE venta SET id_producto = ?, id_bodega = ?, cantidad = ?, Fecha = ?, id_responsable = ? WHERE id_venta = ?",
    [id_product, id_bodega, lot, date, id_user, id_sell],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Venta actualizada correctamente");
    }
  );
});

app.put("/updateSellStatus/:id_sell", (req, res) => {
  const { id_sell } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE venta SET Estado = ? WHERE id_venta = ?",
    [status, id_sell],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el estado de la venta");
      } else {
        res.send("Estado de venta actualizado correctamente");
      }
    }
  );
});

// Obtener usuarios
app.get("/getUsers", (req, res) => {
  db.query(
    `SELECT id_documento, nombre, rol FROM usuario WHERE rol LIKE 'Vendedor%' OR rol = 'Admin';`,
    (err, result) => {
      if (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).send("Error al obtener usuarios");
      } else {
        res.send(result);
      }
    }
  );
});


// ============================
// ADMIN PRODUCTOS
// ============================

// Obtener todos los productos
app.get("/getProducts", (req, res) => {
  db.query("SELECT * FROM producto", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Crear producto
app.post("/createProduct", (req, res) => {
  const { nombre, material, detalle } = req.body;
  db.query(
    "INSERT INTO producto (nombre, material, detalle) VALUES (?, ?, ?)",
    [nombre, material, detalle],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Producto registrado correctamente");
    }
  );
});

// Actualizar producto
app.put("/updateProduct/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  const { nombre, material, detalle } = req.body;
  db.query(
    "UPDATE producto SET nombre = ?, material = ?, detalle = ? WHERE id_producto = ?",
    [nombre, material, detalle, id_producto],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Producto actualizado correctamente");
    }
  );
});

// Eliminar producto
app.delete("/deleteProduct/:id_producto", (req, res) => {
  const { id_producto } = req.params;
  db.query(
    "DELETE FROM producto WHERE id_producto = ?",
    [id_producto],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Producto eliminado correctamente");
    }
  );
});

// ============================
// ADMIN BODEGAS
// ============================

// Obtener todas las bodegas
app.get("/getBodegas", (req, res) => {
  db.query("SELECT * FROM bodega", (err, result) => {
    if (err) {
      console.error("Error al obtener las bodegas:", err);
      return res.status(500).send(err);
    }
    res.send(result);
  });
});

// Obtener stock de un producto en una bodega específica
app.get("/getStock/:id_bodega/:id_producto", (req, res) => {
  const { id_bodega, id_producto } = req.params;
  const sql = `
    SELECT stock 
    FROM bodega_producto 
    WHERE id_bodega = ? AND id_producto = ?
  `;
  db.query(sql, [id_bodega, id_producto], (err, result) => {
    if (err) {
      console.error("Error al obtener el stock:", err);
      return res.status(500).send(err);
    }
    // Si no hay registro, devolver stock 0
    res.send(result.length > 0 ? result[0] : { stock: 0 });
  });
});

// Crear una nueva bodega
app.post("/createBodega", (req, res) => {
  const { nombre } = req.body;
  db.query("INSERT INTO bodega (nombre) VALUES (?)", [nombre], (err, result) => {
    if (err) {
      console.error("Error al crear la bodega:", err);
      return res.status(500).send(err);
    }
    res.send("Bodega registrada correctamente");
  });
});

// Actualizar bodega existente
app.put("/updateBodega/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;
  const { nombre } = req.body;
  db.query("UPDATE bodega SET nombre = ? WHERE id_bodega = ?", [nombre, id_bodega], (err, result) => {
    if (err) {
      console.error("Error al actualizar la bodega:", err);
      return res.status(500).send(err);
    }
    res.send("Bodega actualizada correctamente");
  });
});

// Eliminar una bodega
app.delete("/deleteBodega/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;
  db.query("DELETE FROM bodega WHERE id_bodega = ?", [id_bodega], (err, result) => {
    if (err) {
      console.error("Error al eliminar la bodega:", err);
      return res.status(500).send(err);
    }
    res.send("Bodega eliminada correctamente");
  });
});

// Obtener productos de una bodega específica (para mostrar stock y detalles)
app.get("/getBodegaProducts/:id_bodega", (req, res) => {
  const { id_bodega } = req.params;
  const sql = `
    SELECT bp.id_producto, p.nombre AS nombre_producto, bp.stock, b.nombre AS nombre_bodega
    FROM bodega_producto bp
    INNER JOIN producto p ON bp.id_producto = p.id_producto
    INNER JOIN bodega b ON bp.id_bodega = b.id_bodega
    WHERE bp.id_bodega = ?
  `;
  db.query(sql, [id_bodega], (err, result) => {
    if (err) {
      console.error("Error al obtener productos de la bodega:", err);
      return res.status(500).send(err);
    }
    res.send(result);
  });
});

//VENTAS POR PRODUCTO

// Ventas por producto
app.get("/getVentasPorProducto", (req, res) => {
  const sql = `
    SELECT p.nombre AS nombre_producto, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN producto p ON v.id_producto = p.id_producto
    GROUP BY v.id_producto
    ORDER BY cantidad DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Ventas por bodega
app.get("/getVentasPorBodega", (req, res) => {
  const sql = `
    SELECT b.nombre AS nombre_bodega, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN bodega b ON v.id_bodega = b.id_bodega
    GROUP BY v.id_bodega
    ORDER BY cantidad DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Ventas por usuario
app.get("/getVentasPorUsuario", (req, res) => {
  const sql = `
    SELECT u.nombre AS nombre_usuario, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN usuario u ON v.id_responsable = u.id_documento
    GROUP BY v.id_responsable
    ORDER BY cantidad DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});


// GET usuarios activos (vendedores y administradores)
app.get("/getUsuariosActivos", (req, res) => {
  const sql = `
    SELECT id_documento, nombre, rol 
    FROM usuario 
    WHERE rol IN ('Vendedor', 'Admin') 
    ORDER BY 
      CASE rol
        WHEN 'Admin' THEN 1
        WHEN 'Vendedor' THEN 2
      END,
      nombre ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});
//Get ventas por dia

app.get("/getVentasPorDia", (req, res) => {
  const sql = `
    SELECT DATE(Fecha) as dia, SUM(cantidad) as total
    FROM venta
    GROUP BY DATE(Fecha)
    ORDER BY DATE(Fecha) ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// ============================
// SERVER START
// ============================

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
