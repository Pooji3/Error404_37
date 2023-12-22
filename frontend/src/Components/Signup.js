import React from 'react'
import {useState,useEffect} from "react"
import {Link} from 'react-router-dom'
import axios from "axios"
import {useNavigate} from "react-router-dom"
import "./Signup.css"
import backgroundImage from '../Components/images/coverr.jpg';


const Signup = () => {
    const [name, setName]= useState()
    const [email, setEmail]= useState()
    const [password, setPassword]= useState()
    const [signupError,setSignupError]= useState()
    const [showWelcome,setShowWelcome] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        // Hide the welcome screen after 3 seconds
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000); // 3 seconds

        // Clear the timer if the component unmounts before 3 seconds
        return () => clearTimeout(timer);
    }, []);
    // if (showWelcome) {
    //     return (
    //         <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
    //             <div className="bg-white p-3 rounded w-25 text-center">
    //                 <h2>Welcome to our App!</h2>
    //                 {/* You can add any other content or design here for the welcome screen */}
    //             </div>
    //         </div>
    //     );
    // }

     
    if (showWelcome) {
        return (
            <div className='d-flex justify-content-center align-items-center bg-dark vh-100' style={{ backgroundColor: '#f7f7f7' }} id="b-img" >
                <div className="bg-light p-5 rounded w-75 text-center shadow-lg" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '1px solid #ddd' }}>
                    <h1 style={{ color: '#333' }}>Welcome to our App!</h1>
                    <h4 style={{ color: '#555', marginTop: '20px'}}>Thank you for choosing our platform. Let's get started!</h4>
                    {/* Add any other content or design enhancements here */}
                </div>
          </div>
        );
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = { name, email, password };

        try {
            // First, send the user data to the server to save in the database
            const response = await axios.post('http://localhost:3001/', user);

            if (response.data === 'UserExists') {
                setSignupError('User already exists!');
            } else {
                // After successfully saving the user, get the user data from the response
                const newUser = response.data;

                // Check if the response contains the special key (e.g., _id)
                if (newUser && newUser._id) {
                    // Now, you can navigate to the home page with the special key as a URL parameter
                    navigate(`/home?userId=${newUser._id}`);
                } else {
                    console.error('User data does not contain a valid special key.');
                }
            }
        } catch (error) {
            console.log(error);
            setSignupError('An error occurred while registering.');
        }
    };
  return (
    <>
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100' style={{ 
                backgroundImage: `url(${backgroundImage})`, // Using the imported image
                backgroundSize: 'cover', // Adjust as per your requirement
                backgroundRepeat: 'no-repeat', // Adjust as per your requirement
            }}>
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e)=> setName(e.target.value)}
                        />
                    </div>
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
                        Register
                    </button>
                    </form>
                    {signupError && <p className="text-danger">{signupError}</p>}
                    <p>Already Have an Account</p>
                    <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none btn-marquee">
                        Login
                    </Link>
                
            </div>
        </div>
    </>
  )
}

export default Signup