import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import{BrowserRouter, Routes, Route} from "react-router-dom"
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Components/Home'
import Employee from './Components/Employee'

function App(){
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/employee/:department" element={<Employee/>}/>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App