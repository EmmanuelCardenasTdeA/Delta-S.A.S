import Usuarios from '../pages/usuarios'
import Aside from '../components/Aside'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Layout/Dashboard';
function App() {

  return (
    <>
      <Router>
        <div>
          <Aside></Aside>
          <Routes>
            <Route path='/user' element={<Usuarios/>}></Route>
          </Routes>
        </div>
      </Router>      
    </>
  )
}

export default App
