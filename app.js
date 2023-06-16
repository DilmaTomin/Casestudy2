// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));
// Task2: create mongoDB connection 
mongoose.connect('<YOUR_MONGODB_URI>', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
const Employee = require('./models/employee');
app.get('/api/employeelist', (req, res) => {
    Employee.find({}, (error, employees) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(employees);
        }
    });
});
app.get('/api/employeelist/:id', (req, res) => {
    const id = req.params.id;
    Employee.findById(id, (error, employee) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
        } else {
            res.json(employee);
        }
    });
});

// Add a new employee
app.post('/api/employeelist', (req, res) => {
    const { name, location, position, salary } = req.body;
    const newEmployee = new Employee({ name, location, position, salary });
    newEmployee.save((error) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Employee added successfully' });
        }
    });
});

// Delete an employee by ID
app.delete('/api/employeelist/:id', (req, res) => {
    const id = req.params.id;
    Employee.findByIdAndDelete(id, (error, employee) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
        } else {
            res.json({ message: 'Employee deleted successfully' });
        }
    });
});

// Update an employee by ID
app.put('/api/employeelist/:id', (req, res) => {
    const id = req.params.id;
    const { name, location, position, salary } = req.body;
    Employee.findByIdAndUpdate(id, { name, location, position, salary }, (error, employee) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
        } else {
            res.json({ message: 'Employee updated successfully' });
        }
    });
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


