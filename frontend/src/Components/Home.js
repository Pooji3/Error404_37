import React from 'react'
import {useState, useEffect} from "react"
import { Link,useLocation } from 'react-router-dom'
import "./Home.css"
import Form from './Form'
import axios from 'axios'


const Home = () => {
  const [isComplaintModalOpen, setComplaintModalOpen] = useState(false);
  const location = useLocation()
  const userId= new URLSearchParams(location.search).get('userId')
  const [complaints, setComplaints] = useState([]);
  const [complaintActions, setComplaintActions]= useState({});
  const [searchQuery, setSearchQuery]= useState('');
  

  useEffect(() => {

    
    // Make an API request to fetch complaints from your Node.js server
    axios.get('http://localhost:3001/form') // Replace with your server URL
      .then((response) => {
        
        //const healthComplaints = response.data.filter(complaint=>complaint.department === 'Health')
        //setComplaints(healthComplaints);
        const departmentComplaints = response.data.filter(complaint=>complaint.userId === userId);
        setComplaints(departmentComplaints);
         
        Promise.all(departmentComplaints.map(complaint => {
         return axios.get(`http://localhost:3001/updates/${complaint._id}`)
           .then((actionResponse) => {
             if (actionResponse.data) {
               // If there is a matching action, store it in the state
               setComplaintActions(prevActions => ({
                 ...prevActions,
                 [complaint._id]: actionResponse.data,
               }));
             } else {
               // If no matching action, set default values
               setComplaintActions(prevActions => ({
                 ...prevActions,
                 [complaint._id]: { status: "In Progress", actionDescription: "Action Not Taken" },
               }));
             }
           });
       }));
     })
         
        
      
      
 
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);
 

  


  

  const toggleComplaintModal = () => {
    setComplaintModalOpen(!isComplaintModalOpen);
  };
  return (
    <>
    <center>
    <h2>Hello User</h2>
    </center>
    
    <div className="navbar">
  <div className="navbar-title">User Dashboard</div>
  <div className="navbar-right">
    <div className="btn btn-primary mx-1" onClick={toggleComplaintModal}>Register Complaint</div>
    <Link className="btn btn-primary mx-1" to="/login">Log Out</Link>
  </div>
</div>
<br/>
<br/>

<h2>Complaint List</h2>
<input className='searchbox'
      type="text"
      placeholder="Search complaints....."
      value={searchQuery}
      onChange={(e)=>setSearchQuery(e.target.value)}
      />
      <br/>
      <br/>
     
      <div className="card-container">
        {complaints
        .filter((complaint)=>{
            const query = searchQuery.toLowerCase();
            return Object.values(complaint).some((value)=>{
              if(typeof value === 'string'){
                return value.toLowerCase().includes(query)
              }
              return false
            })
          })
        
        
        
        
        .map((complaint) => (
          
            <div key={complaint._id} className="card">
            <h5>Complaint Text</h5>
            <p>{complaint.complaintText}</p>
            <h5>Date</h5>
            <p>{complaint.date}</p>
            <h5>Uploaded file</h5>
            <a href={`http://localhost:3001/complaints/${complaint._id}/image`} target="_blank" rel="noopener noreferrer"> View </a>
            {/* <h5>Status</h5>
            <p>{complaintActions[complaint._id] ? complaintActions[complaint._id].status : 'In Progress'}</p>
            <h5>Action Description</h5>
            <p>{complaintActions[complaint._id] ? complaintActions[complaint._id].actionDescription : 'Action Not Taken'}</p> */}
            <br/>
            <h5>Action File</h5>
{complaintActions[complaint._id] ? (
  <div>
    {complaintActions[complaint._id].file ? (
    <a
      href={`http://localhost:3001/updates/${complaint._id}/image`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Image
    </a>
    ):(
      <p>No Image Uploaded</p>
    )}
    <br />
    <br/>
    <h5>Status:</h5>
    <p> {complaintActions[complaint._id].status}</p>
    <h5>Action Description:</h5>
    <p> {complaintActions[complaint._id].actionDescription}</p>
  </div>
) : (
  <div>
    <h5>Status:</h5>
    <p> In Progress</p>
    <h5>Action Description:</h5>
    <p>Action Not Taken</p>
  </div>
)}
            
            
            {/* Add other fields as needed */}
          </div>
          
        ))}
      </div>


<Form
        isOpen={isComplaintModalOpen}
        toggleModal={toggleComplaintModal}
        userId={userId}
        
      />
      <br></br>
      <br></br>
<div class="card text-bg-secondary">
<div className="card-body">
<div className="customer-care">
        <center><h3>Need more assistance?</h3>
        <p>Contact our customer care:</p>
        <p>• Phone: +123-456-7890</p>
        <p>• Email: support@yourcompany.com</p></center>
      </div>
      </div>
      </div>
    </>

  )
}

export default Home
