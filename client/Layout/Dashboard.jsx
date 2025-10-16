import React from 'react'
import Aside from '../components/Aside'
import { Outlet } from 'react-router-dom'
function Dashboard() {
  return (
    <div>
        <div className='flex min-h-screen bg-gray-100'>
            <Aside></Aside>
            <main className='flex-1 p-6'>
                <Outlet></Outlet>
            </main>
        </div>
    </div>
  )
}

export default Dashboard