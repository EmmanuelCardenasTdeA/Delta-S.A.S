const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localHost",
    user: "root",
    password: "",
    database: "inventariodeltav2"

})

app.post("/createUser", (req, res) =>{
    const id_document = req.body.id_document;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const rol = req.body.rol;

    db.query("INSERT INTO usuario (id_documento, nombre, apellido, rol) VALUES (?,?,?,?)", [id_document,name,lastName, rol],
        (err, result) => {
            if(err){
                console.log(err)
            } else{
                res.send("Empleado Registrado correctamente")
            }
        }
    )
})

app.get("/getUser", (req, res) =>{
    
    db.query("SELECT * FROM usuario",
        (err, result) => {
            if(err){
                console.log(err)
            } else{
                res.send(result)
            }
        }
    )
})

app.put("/updateUser",(req,res)=>{
    const old_id_document = req.body.old_id_document;
    const id_document = req.body.id_document;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const rol = req.body.rol;
    

    db.query("UPDATE usuario SET id_documento = ?, nombre = ?, apellido = ?, rol = ? WHERE id_documento = ?", [id_document, name, lastName, rol, old_id_document],
        (err, result) =>{
            if(err){
                console.log(err)
            }else{
                res.send("Empleado actualizado correctamente")
            }
        }
    )
})

app.delete("/deleteUser/:id_document", (req, res) =>{
    const id_document = req.params.id_document;

    db.query("DELETE FROM usuario WHERE id_documento = ?", [id_document], 
        (err, result) =>{
            if(err){
                console.log(err)
            }else{
                res.send("Empleado eliminado correctamente")
            }
        }
    )
})

app.listen(3000,() => {
    console.log('Server cumming in SU PTMADRE ' + 3000)
})