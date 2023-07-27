// Task1: initiate app and run server at 3000
const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
require('dotenv').config()
const PORT = process.env.PORT;
// to get json data
app.use(express.json());
app.use(express.urlencoded({ extented: true }));
app.listen(PORT, () => {
    console.log(`inside the port ${PORT}`)
})
// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data
const path = require('path');
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));
// Task2: create mongoDB connection 
const mongoose = require('mongoose');
mongoose.connect(process.env.mongodb_url)
    .then(() => {
        console.log("connected to my  DB")
    })
    .catch(() => {
        console.log("Error!!! connection lost")
    })
const employeeSchema = mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const employeeData = mongoose.model('employee', employeeSchema)
//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const data = await employeeData.find();
        console.log("data",data)
        res.status(200).json(data)
    } catch (err) {
        res.status(400).json('cannot get data',err)
    }
})



//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        var empid=req.body.id;
        const data = await employeeData.findById(empid);
        res.status(200).json(data)
    } catch (err) {
        res.status(400).json('cannot get data')
    }
})


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        console.log(req.body)
        const item = req.body;
        const newData = new employeeData(item);// adding item to schema
        const saveData = await newData.save();
        res.status(200).json('post successful')
    } catch (err) {
        res.status(400).json('post denied')
    }
})


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete("/api/employeelist/:id", async (req, res) => {
    try {
        empid = req.params.id;
        // console.log(pos)
        const data = await employeeData.findOneAndDelete({ _id: empid });
        res.send(data);

    } catch (error) {
        console.log(error);
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put("/api/employeelist/", async (req, res) => {
    try {
        newdata = req.body;
        console.log("req.body",req.body)
        empid = req.body._id;
        console.log(empid)
        const data = await employeeData.findByIdAndUpdate(empid, {
            $set: {
                name: newdata.name,
                location: newdata.location,
                position: newdata.position,
                salary: newdata.salary,
            },
        });

        res.send(data);

    } catch (error) {
        console.log(error.message);
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});






