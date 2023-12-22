import React, { useState } from 'react';
import Modal from 'react-modal'

import './Form.css'
import axios from "axios"
//import {useNavigate} from "react-router-dom"
Modal.setAppElement('#root');

const UpdateModal = ({isOpen, toggleModal, complaintID,userId}) => {
  const [actionDescription, setActionDescription] = useState('');
  const [file, setFile] = useState(null);
  const[status,setStatus]=useState('In Progress');
  //const navigate = useNavigate()
  
  
  
  const handleUpdateModal = (event) => {
    event.preventDefault();
    const updateData = new FormData();
    updateData.append('actionDescription',actionDescription);
    updateData.append('file',file);
    updateData.append('status',status);
    updateData.append('complaintID',complaintID)
    updateData.append('userId',userId)

    
    // Handle form submission here
        axios.post('http://localhost:3001/updateModal',updateData)
        .then(result=>{
            
        console.log('Response:',result.data)
        // navigate("/employee/:department")
        
      
            
        })
        .catch(err=>console.error('Error:',err))

        axios.get(`http://localhost:3001/updates/${complaintID}`)
    .then((updateResponse) => {
      // If there is a matching update (equivalent to action), store it in the state
      const update = updateResponse.data;
      console.log('Update Response:', update);
      setActionDescription(update.actionDescription);
      setStatus(update.status);
      setFile(update.file);
    })
    .catch((err) => {
      console.error('Error fetching updates:', err);
    });
    
    toggleModal(); // Close the modal after submission
  
  
}
  return (
    <>
    
    <Modal className="modal"
      isOpen={isOpen}
      onRequestClose={toggleModal}
      
    >
      
      <div className="modal-content">
      <h2>Update Complaint</h2>
        <label className="id">
          Complaint ID:
          <input type="text"  value={complaintID} readOnly/>
          </label>
          
        
        <form onSubmit={handleUpdateModal}>
          
          <label>
            Action Description:
            
            <textarea
              name="actionDescription"
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              rows="4"
            />
          </label>
          <label> Upload File:
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          </label>
          <label>
            Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </label> 

          <button type="submit">Save</button>
          <button type="button" onClick={toggleModal}>
            Cancel
          </button>
        </form>
        
      </div>
    </Modal>
    
    </>
  )
}

export default UpdateModal