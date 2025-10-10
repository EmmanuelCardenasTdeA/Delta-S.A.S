import React from 'react'
import Header from '../components/Header'
import Aside from '../components/Aside'
import { Outlet } from 'react-router-dom'
function Dashboard() {
  return (
    <div>
        <Header></Header>
        <div>
            <Aside></Aside>
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    </div>
  )
}

export default Dashboard