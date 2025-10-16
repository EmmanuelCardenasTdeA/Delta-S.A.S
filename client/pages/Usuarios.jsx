import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const noti = withReactContent(Swal);

function Usuarios() {
    const [id_document, setId_document] = useState(null);
    const [name, setNombre] = useState("");
    const [lastName, setApellido] = useState("");
    const [old_id_document, setOld_id_docuement] = useState(null);
    const [rol, setRol] = useState("");

    const [userList, setUserList] = useState([]);
    
    const [update, setUpdate] = useState(false);



    const addUser = () =>{
        if (!id_document || !name || !lastName || !rol) {
            noti.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos antes de registrar.',
            confirmButtonColor: '#f97316',
            })
        return
        }
        axios.post("http://localhost:3000/createUser",{
            id_document: id_document,
            name: name,
            lastName: lastName,
            rol: rol
        }).then(() =>{
            getUser();
            noti.fire({
                title: <strong>Registro Exitoso!</strong>,
                html: <i>El Empleado/a {name} fue registrado/a con éxito</i>,
                icon: 'success'
            })
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
            noti.fire({
                title: <strong>Acualización Exitosa!</strong>,
                html: <i>El Empleado/a {name} fue actualizado/a con éxito</i>,
                icon: 'success'
            })
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

    const deleteUser = (val) =>{
        noti.fire({
                title: <strong>Eliminar Usuario</strong>,
                html: <i><strong>¿Realmente desea eliminar a {val.nombre}?</strong></i>,
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                icon: 'warning'
            }).then((res)=>{
                if(res.isConfirmed){
                    axios.delete(`http://localhost:3000/deleteUser/${val.id_documento}`).then(() =>{
                    getUser();})
                    noti.fire({
                        title: <strong>Usuario Eliminado!</strong>,
                        html: <i>Usuario Eliminado con exito</i>,
                        icon: 'success'
                    })
                }
            })
        
    }

  return (

    // Formulario

    <div className='flex flex-col gap-8 w-full h-full"'>
        <h1 className='text-3xl font-bold text-gray-800'>Gestion Usuarios</h1>
        <div className='bg-white shadow-md rounded-xl p-6 w-full'>
        <label>Id: <input className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" value={id_document} onChange={(event) =>{setId_document(event.target.value)}} type="number"/></label>
        <label>Nombre: <input className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" value={name} onChange={(event) =>{setNombre(event.target.value)}} type="text" /></label>
        <label>Apellido: <input className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" value={lastName} onChange={(event) =>{setApellido(event.target.value)}} type="text" /></label>
        <label>Rol: <input className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" value={rol} onChange={(event) =>{setRol(event.target.value)}} type="text" /></label>
        <div className='mt-4 flex gap-4'>
        {
            update ? 
            <><button onClick={updateUser} className='bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600'>Actualizar</button><button onClick={()=> {clearData(); setUpdate(false)}} className='bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500'>Cancelar</button></>
            :<button className='bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 ' onClick={addUser}>Registrar</button>
        }
        </div>
        </div>

        {/* Lista de usuarios */}

        <div className='flex-1 overflow-y-auto bg-white shadow-md rounded-xl p-6'>
            <table className="w-full text-left border-collapse">
                <thead className='sticky top-0 bg-gray-100 z-10'>
                    <tr className="border-b bg-gray-50">
                    <th className="p-3 font-semibold text-gray-700">ID</th>
                    <th className="p-3 font-semibold text-gray-700">Nombre</th>
                    <th className="p-3 font-semibold text-gray-700">Apellido</th>
                    <th className="p-3 font-semibold text-gray-700">Rol</th>
                    <th className="p-3 font-semibold text-gray-700 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    

            {
                userList.map((val,key)=>
                    <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="p-3">{val.id_documento}</td>
                    <td className="p-3">{val.nombre}</td>
                    <td className="p-3">{val.apellido}</td>
                    <td className="p-3">{val.rol}</td>
                    <td className="p-3 text-center">
                        <button onClick={() => loadUser(val)} className='bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-700 mx-1'>Editar</button>
                        <button onClick={() => deleteUser(val)} className='bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 mx-1'>Eliminar</button>
                    </td>
                    </tr>
                )
            }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Usuarios

