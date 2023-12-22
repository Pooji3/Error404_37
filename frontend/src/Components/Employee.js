import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useParams, useLocation} from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import "./Home.css"
import UpdateModal from './UpdateModal'

const Employee = () => {
  const {department}= useParams();
  const location = useLocation()
  const userId=new URLSearchParams(location.search).get('userId')
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage]= useState(0);
  // const [modalIsOpen, setModalIsOpen]=useState(false);
  const itemsPerPage =10;
  
 const[selectedComplaintId, setSelectedComplaintId]=useState(null);
 const [searchQuery, setSearchQuery]= useState('')
 
 
  useEffect(() => {

    
    // Make an API request to fetch complaints from your Node.js server
    axios.get('http://localhost:3001/form') // Replace with your server URL
      .then((response) => {
        //const healthComplaints = response.data.filter(complaint=>complaint.department === 'Health')
        //setComplaints(healthComplaints);
        const departmentComplaints = response.data.filter(complaint=>complaint.department === department)
        
        //setComplaints(departmentComplaints)
        Promise.all(departmentComplaints.map(complaint => axios.get(`http://localhost:3001/updates/${complaint._id}`)))
          .then((statusResponses) => {
            // Combine complaints and their status
            const complaintsWithStatus = departmentComplaints.map((complaint, index) => ({
              ...complaint,
              status: statusResponses[index].data.status,
            }));
            setComplaints(complaintsWithStatus);
          })
          .catch((error) => {
            console.error(error);
          });
        
      
      })
      .catch((error) => {
        console.error(error);
      });
  }, [department]);

  const handleUpdateModal = (complaintID)=>{
    setSelectedComplaintId(complaintID);
    toggleActionModal();
  };


  const handlePageChange=({selected})=>{
    setCurrentPage(selected);
  }
  const startIndex= currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const [isActionModalOpen, setActionModalOpen] = useState(false);

  const toggleActionModal = () => {
    setActionModalOpen(!isActionModalOpen);
  };


  

  return (
    <div>
      <center>
        <h2>Hello Admin</h2>
      </center>
    
      <div className="navbar">
      <div className="navbar-title">Admin Dashboard</div>
      <div className="navbar-right">
        
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

      <table className="table-container">
        <thead>
          <tr>
            
            <th>ComplaintText</th>
            <th>Date</th>
            <th>Location</th>
            <th>File</th>
            <th>Status</th>
            
            
            {/* Add other table headers based on your schema */}
          </tr>
        </thead>
        <tbody>
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
          
          .slice(startIndex,endIndex).map((complaint) => (
            <tr key={complaint._id}>
              <td>{complaint.complaintText}</td>
              <td>{complaint.date}</td>
              <td>{complaint.location}</td>
              <td><a href={`http://localhost:3001/complaints/${complaint._id}/image`} target="_blank" rel="noopener noreferrer"> View </a>
                </td>
              <td>
                <button className="update-button" onClick={()=>handleUpdateModal(complaint._id)} >Update</button>
                {complaint.status}
              </td>
              {/* Add other fields as needed */}
              
            </tr>
          ))}

        </tbody>
      </table>
      {/* Add the pagination component */}
      {/* <ReactPaginate 
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(complaints.length / itemsPerPage)} // Calculate total pages
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'} */}
        <ReactPaginate
  previousLabel={'Previous'}
  nextLabel={'Next'}
  breakLabel={'...'}
  pageCount={Math.ceil(complaints.length / itemsPerPage)}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageChange}
  containerClassName={'pagination-container'} // Use the adjusted class name
  pageClassName={'page-item'} // Add a class for individual page links
  previousClassName={'page-item'}
  nextClassName={'page-item'}
  activeClassName={'active'}
  breakClassName={'page-item'}
/>
    
      
      <UpdateModal
        isOpen={isActionModalOpen}
        toggleModal={toggleActionModal}
        complaintID={selectedComplaintId}
        userId={userId}
      />
      
      {/* {modalIsOpen && (
        <UpdateModal
          isOpen={modalIsOpen}
          handleClose={handleCloseModal}
          handleUpdate={handleSaveUpdate}
        />
      )} */}
    </div>
  );
};

export default Employee;

