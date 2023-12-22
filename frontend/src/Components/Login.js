import React from 'react'
import {useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
//import Employee from './Employee'

//import { Link } from 'react-router-dom'

import backgroundImage from '../Components/images/coverr.jpg';

const Login = () => {
    
    const [email, setEmail]= useState()
    const [password, setPassword]= useState()
    const [loginError, setLoginError]=useState()
    const navigate = useNavigate()
    
    //const [userID, setUserID]= useState('');


    const handleSubmit =(e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/login',{email,password})
        .then(result=>{
            //console.log(result)
            if(result.data.status === "Success"){
                    const userId= result.data.userId
                    //setUserID(result.data.userID);
                    if(email.endsWith('@health.gov.in')){
                        navigate(`/employee/Health?userId=${userId}`)
                    }else if(email.endsWith('@electricity.gov.in')){
                        navigate(`/employee/Electricity?userId=${userId}`)
                    }
                    else if(email.endsWith('@wrd.gov.in')){
                        navigate(`/employee/Water Resources?userId=${userId}`)
                    }
                    else if(email.endsWith('@pwd.gov.in')){
                        navigate(`/employee/Public Works?userId=${userId}`)
                    }
                    else if(email.endsWith('@mcd.gov.in')){
                        navigate(`/employee/Municipal Corporation?userId=${userId}`)
                    }else if(email.endsWith('@edu.gov.in')){
                        navigate(`/employee/Education?userId=${userId}`)
                    }

                else{
                navigate(`/home?userId=${userId}`)
                }
            }else{
                setLoginError("Incorrect email or password.Please try again!")
            }
        })
        .catch(err=>console.log(err))
    }
  return (
    <>
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100' style={{ 
                backgroundImage: `url(${backgroundImage})`, // Using the imported image
                backgroundSize: 'cover', // Adjust as per your requirement
                backgroundRepeat: 'no-repeat', // Adjust as per your requirement
            }}>
            <div className="bg-white p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-success w-100 rounded-0 btn-marquee">
                        Login
                    </button>
                    
                    </form>
                   {loginError && <p className="text-danger">{loginError}</p>} 

                   
                
            </div>

        </div>
    </>
  )
}

export default Login