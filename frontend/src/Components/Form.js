import React from 'react'
import Modal from 'react-modal'
import {useState} from "react"
import './Form.css'
import axios from "axios"
import {useNavigate} from "react-router-dom"
Modal.setAppElement('#root');

const Form = ({isOpen, toggleModal,userId}) => {
  const [complaintText, setComplaintText] = useState('');
  const [date, setDate] = useState('');
  //const [department, setDepartment] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate()

  
  const handleFormSubmit = (event) => {
    event.preventDefault();


//     const determineDepartment=(complaintText)=>{
//     if (complaintText.toLowerCase().includes('electricity')) {
//         return 'Electricity Department';
//       }
//         if (complaintText.toLowerCase().includes('health')) {
//           return 'Health Department';
//       }
//       if (complaintText.toLowerCase().includes('sewage','waste','civic')) {
//         return 'Muncipal cooperation';
//     } 
//     if (complaintText.toLowerCase().includes('maintainance','public')) {
//       return 'public work department';
//   }
//   if (complaintText.toLowerCase().includes('water')) {
//     return 'water department';
// }
// if (complaintText.toLowerCase().includes('school','education')) {
//   return 'Education department';
// }
//     else {
//         // Default department if no match is found
//         return 'General Department';
//       }
//     };


    const formData = new FormData();
    formData.append('complaintText',complaintText);
    formData.append('date',date);
    //const department=determineDepartment(complaintText)
    //formData.append('department',department);
    formData.append('complaintFile',file);
    formData.append('userId',userId)

    axios.post('http://localhost:3001/classify', formData)
    .then(result => {
      const department = result.data.department; // Extract the department from the response
      console.log('Department:', department);
      formData.append('department', department);
    // Handle form submission here
        axios.post('http://localhost:3001/form',formData)
        .then(result=>{
            
        console.log('Response:',result.data)
        navigate(`/home?userId=${userId}`)
            
        })
        .catch(err=>console.error('Error:',err))
    
    toggleModal(); // Close the modal after submission
  })
  .catch(err=>console.error('Error:',err))
}
  return (
    <>
    
    <Modal className="modal"
      isOpen={isOpen}
      onRequestClose={toggleModal}
      
    >
      <div className="modal-content">
        <h2>Register Complaint</h2>
        <form onSubmit={handleFormSubmit}>
          <label>
            Complaint Text:
            <textarea
              name="complaintText"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              rows="4"
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
            />
          </label>
          {/* <label>
            Department:
            <select
              name="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value=" ">  </option>
              <option value="Manglore City Corporation">Manglore City Corporation</option>
              <option value="Shivamogga City Corporation">Shivamogga City Corporation</option>
              <option value="Kaup Town Municipal Council">Kaup Town Municipal Council</option>
              <option value="Malpe Municipal Office">Malpe Municipal Office</option>
            </select>
          </label> */}
           <input
            type="file"
            name="complaintFile"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br></br>
          <br></br> 

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

export default Form