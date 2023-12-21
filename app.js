if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Patient = require("./models/patient");
const errorMiddleware = require("./middleware/error");
const catchAsyncError = require("./middleware/catchAsyncError");

const app = express();

const MongoDbUrl = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/patientInfo';

main().catch(err => console.log(`Mongo ERROR, ${err}`));
async function main() {
    await mongoose.connect(MongoDbUrl);
    console.log("MONGO CONNECTION OPEN!!")
}








app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);


//List of all the patients:
app.get("/patient", catchAsyncError(async (req, res) => {

    const showAllPatient = await Patient.find({});

    res.status(200).json({ success: true, showAllPatient })
}))


//Single patient with the ID:
app.get("/patient/:id", catchAsyncError(async (req, res, next) => {
    const showPatientById = await Patient.findById(req.params.id);

    if (!showPatientById) {
        return next(new ErrorHandler("Patient not found with this Id", 404))
    }

    res.status(200).json({ success: true, showPatientById })
}))


//Create new Patient: 
app.post("/patient", catchAsyncError(async (req, res) => {

    const newPatient = await Patient.create(req.body);
    res.status(200).json({ success: true, newPatient })

}))


//Edit the Patient's status with the ID
app.put("/patient/:id", catchAsyncError(async (req, res, next) => {
    const showPatientById = await Patient.findById(req.params.id);

    if (!showPatientById) {
        return next(new ErrorHandler("Patient not found with this Id", 404))
    }

    const findAndUpdatePatientStatus = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({ success: true, findAndUpdatePatientStatus })
}))


//Delete the Patient's info with ID
app.delete("/patient/:id", catchAsyncError(async (req, res, next) => {
    const showPatientById = await Patient.findById(req.params.id);

    if (!showPatientById) {
        return next(new ErrorHandler("Patient not found with this Id", 404))
    }

    deletePatientInfo = await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Patient's info deleted successfully" })
}))


app.listen(3000, () => {
    console.log("Listeing on Port 3000!!")
})
