import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Details from './Pages/Details'
import CustomerDashboard from './Pages/customer/Dashboard'
import Request from './Pages/customer/Request';
import AdminDashboard from './Pages/admin/Dashboard'
import TechnicianDashboard from './Pages/technician/Dashboard'
import ManageTechnicians from './Pages/admin/Technician'
import AddTechnician from './Pages/admin/AddTechnician'
import AdminRequests from './Pages/admin/Requests'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/customer/dashboard' element={<CustomerDashboard/>} />
      <Route path='/customer/request' element={<Request/>} />
      <Route path='/admin/dashboard' element={<AdminDashboard/>} />
      <Route path='/admin/technicians' element={<ManageTechnicians/>} />
      <Route path='/admin/add-technician' element={<AddTechnician/>} />
      <Route path='/admin/requests' element={<AdminRequests/>} />
      <Route path='/technician/dashboard' element={<TechnicianDashboard />} />
      <Route path='/job-details/:id' element={<Details />} />
    </Routes>
  )
}

export default App
