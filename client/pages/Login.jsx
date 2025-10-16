import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const noti = withReactContent(Swal);
function Login() {

    const [ user, setUser ] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
    

        if(user && password) {
            localStorage.setItem("auth", "true")
            navigate("/");
        }else {
            noti.fire({
                title:"Error",
                html: <i>Usuario o contaseña incorrecta</i>,
                icon: "error",

            })
        }
    }
  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo */}
      <div
        className="hidden md:flex w-2/3 bg-cover bg-center justify-start items-start p-6" style={{backgroundImage: "url('../public/1065.jpg')"}}
      >
        <div className="text-black text-9xl font-bold flex items-center gap-3 ">
          DELTA
        </div>
      </div>

      {/* Lado derecho */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="w-80 flex flex-col space-y-5 p-8 rounded-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-left">
            Log in
          </h2>

          <input
            type="text"
            placeholder="Email"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-orange-600 transition"
              onClick={() =>
                noti.fire({
                  icon: "info",
                  title: "Recuperar contraseña",
                  text: "Esta función aún no está disponible.",
                  confirmButtonColor: "#ea580c",
                })
              }
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login