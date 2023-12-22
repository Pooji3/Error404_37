const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const FormSchema = new mongoose.Schema({
    userId:String,
    complaintText:String,
    date:String,
    department:String,
    file:Buffer,
    location:String,
    
    
})

const UpdateSchema = new mongoose.Schema({
    complaintID:String,
    userId:String,
    actionDescription:String,
    file:Buffer,
    status:String,
    
})


const UserModel = mongoose.model("users",UserSchema)
const FormModel = mongoose.model("complaints",FormSchema)
const UpdateModel = mongoose.model("actions",UpdateSchema)
module.exports = {
    UserModel,FormModel,UpdateModel
}