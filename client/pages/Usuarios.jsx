import React from 'react'
import { useState } from 'react'
import axios from 'axios';
function Usuarios() {
    const [id_document, setId_document] = useState(null)
    const [name, setNombre] = useState("")
    const [lastName, setApellido] = useState("")
    const [old_id_document, setOld_id_docuement] = useState(null)
    const [rol, setRol] = useState("")

    const [userList, setUserList] = useState([]);
    
    const [update, setUpdate] = useState(false)
    const addUser = () =>{
        axios.post("http://localhost:3000/createUser",{
            id_document: id_document,
            name: name,
            lastName: lastName,
            rol: rol
        }).then(() =>{
            getUser();
            alert("Empleado registrado correctamente");
            clearData();
        });
    }

    const getUser = () =>{
        axios.get("http://localhost:3000/getUser",{}).then((response) =>{
            setUserList(response.data);
        });
    }

    getUser();

    const loadUser = (val) =>{
        setUpdate(true);
        setId_document(val.id_documento);
        setOld_id_docuement(val.id_documento)
        setNombre(val.nombre);
        setApellido(val.apellido);
        setRol(val.rol);
    }

    const updateUser = () =>{
        axios.put("http://localhost:3000/updateUser",{
            old_id_document: old_id_document,
            id_document: id_document,
            name: name,
            lastName: lastName,
            rol: rol
        }).then(() =>{
            alert("Empleado actualizado correctamente")
            setUpdate(false);
            clearData();
        })
    }

    const clearData = () =>{
        setId_document("");
        setOld_id_docuement(null);
        setNombre("");
        setApellido("");
        setRol("");
    }

    const deleteUser = (id_document) =>{
        axios.delete(`http://localhost:3000/deleteUser/${id_document}`).then(() =>{
            alert("Empleado eliminado correctamente")
            getUser();
        })
    }

  return (
    <div>
        <div>
        <label>Id: <input value={id_document} onChange={(event) =>{setId_document(event.target.value)}} type="number"/></label>
        <label>Nombre: <input value={name} onChange={(event) =>{setNombre(event.target.value)}} type="text" /></label>
        <label>Apellido: <input value={lastName} onChange={(event) =>{setApellido(event.target.value)}} type="text" /></label>
        <label>Rol: <input value={rol} onChange={(event) =>{setRol(event.target.value)}} type="text" /></label>
        {
            update ? 
            <div><button onClick={updateUser}>Actualizar</button><button onClick={()=> {clearData(); setUpdate(false)}}>Cancelar</button></div>
            :<button onClick={addUser}>Registrar</button>
        }
        
        </div>
        <div>

            {
                userList.map((val,key)=>
                {
                    return <div key={key}> 
                        <hr />
                        <h3>Id: {val.id_documento}</h3>
                        <h3>Nombre: {val.nombre}</h3>
                        <h3>Apellido: {val.apellido}</h3>
                        <h3>Rol: {val.rol}</h3>
                        <button onClick={()=>loadUser(val)}>Editar</button>
                        <button onClick={()=>deleteUser(val.id_documento)}>Eliminar</button>
                        <hr/>
                    </div>
                })
            }
        </div>
    </div>
  )
}

export default Usuarios