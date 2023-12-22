const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const multer=require('multer')
const fs = require('fs')
const ExifParser = require('exif-parser')
const {UserModel,FormModel,UpdateModel}=require('./models/User')
const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/TEAM37");

const NodeGeocoder = require('node-geocoder')
const geocoderOptions = {
    provider:'openstreetmap'
}
const geocoder=  NodeGeocoder(geocoderOptions)

const {trainModel, predictDepartment}=require('./complaintClassifier.js')
  trainModel()

  
  app.get('/form', async (req, res) => {
    try {
      const complaints = await FormModel.find({}).exec();
      res.json(complaints);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching complaints.' });
    }
  })

  app.get('/updates/:complaintID', async (req, res) => {
    const { complaintID } = req.params;
  
    try {
      // Fetch the corresponding update (equivalent to action) based on complaintId
      const update = await UpdateModel.findOne({ complaintID: complaintID }).exec();
  
    //   if (update) {
    //     res.json(update);
    //   } else {
    //     res.json({ status: "In Progress", actionDescription: "Action Not Taken" });
    //   }
    // } 
    if (update) {
      const { status, actionDescription, file } = update;
      res.json({ status, actionDescription, file });
    } else {
      res.json({
        status: "In Progress",
        actionDescription: "Action Not Taken",
        file: null,
      });
    }
  }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching updates.' });
    }
  });

  app.get('/updates/:complaintId/image', async (req, res) => {
    const { complaintId } = req.params;
  
    try {
      const update = await UpdateModel.findOne({ complaintID: complaintId }).exec();
  
      if (update && update.file) {
        res.contentType('image/jpeg'); // Adjust the content type as per your actual data type
        res.send(update.file);
      } else {
        res.status(404).send('Image not found.');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching the Image.');
    }
  });
  

  

  app.get('/complaints/:complaintId/image', async (req, res) => {
    const { complaintId } = req.params;
  
    try {
      // Use async/await to fetch the complaint
      const complaint = await FormModel.findById(complaintId).exec();
  
      if (!complaint || !complaint.file) {
        return res.status(404).send('Complaint not found or no file attached.');
      }
  
      // Send the binary data as an image
      res.contentType('image/jpeg'); // Adjust the content type as per your actual data type
      res.send(complaint.file);
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send('Error fetching the complaint');
    }
  });
  
  

app.post('/login',(req,res)=>{
    const{email,password}=req.body;
    UserModel.findOne({email:email})
    .then(user=>{
        if(user){
            if(user.password === password){
                res.json({status:'Success',userId:user._id})
            }else{
                res.json("the password is incorrect")
                
            }
        }else{
            res.json("No record existed")
        }
    })
})

app.post('/', async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user with the provided email already exists
      const existingUser = await UserModel.findOne({ email: email });

      if (existingUser) {
          res.json('UserExists');
      } else {
          // Create the new user and save it in the database
          const newUser = await UserModel.create(req.body);

          // Respond with the newly created user, which should contain the special key (e.g., _id)
          res.json(newUser);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json('An error occurred while registering.');
  }
});


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/'); // Folder where files will be stored
        },
        filename: function (req, file, cb) {
          // Use a unique filename, for example, a timestamp
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      });

      const upload = multer({storage:storage})

      app.post('/classify', upload.single('complaintFile'), (req, res) => {
        const { complaintText } = req.body;
      
        // Use the complaintClassifier to predict the department
        const department = predictDepartment(complaintText);
      
        res.json({ department }); // Return the department as a response
      });
    
      
app.post('/form',upload.single('complaintFile'), (req, res) => {
    const { userId,complaintText, date, department } = req.body;
    const file = req.file;
    const fileData = fs.readFileSync(file.path)
    const buffer = new Buffer.from(fileData)

    const exifData = ExifParser.create(fileData)
    const exifResult = exifData.parse()
   const latitude = exifResult.tags.GPSLatitude
   const longitude = exifResult.tags.GPSLongitude

   geocoder.reverse({lat:latitude,lon:longitude})
   .then((result)=>{
    const city = result[0].city||'Unknown'
    const location = latitude+','+longitude+','+city

    FormModel.create({ userId,complaintText, date, department, file: buffer, location })
     .then(complaints=>res.json(complaints))
     .catch(err=>res.json(err))
})
.catch(err => res.json(err))

})  



app.post('/updateModal',upload.single('file'), (req, res) => {
  const { complaintID,userId,actionDescription, status } = req.body;
  const file = req.file;
  const fileData = fs.readFileSync(file.path)
  const buffer = new Buffer.from(fileData)
  UpdateModel.create({ complaintID,userId,actionDescription, file: buffer, status })
   .then(actions=>res.json(actions))
   .catch(err=>res.json(err))
})



  
app.listen(3001,()=>{
    console.log("server is running")
})