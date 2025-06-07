const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//express app
const app = express();

const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Employee = require('./models/Employee');

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find(); // Get all employees from the DB
    res.json(employees);                     // Send them back to the client
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async(req, res) => {
    try {
        const { name, email, position, department } = req.body;
        if (!name || !email || !position || !department) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
        const newEmployee = new Employee({
            name,
            email,
            position,
            department,
        });
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    
    }catch(error){
        res.status(500).json({message: 'Failed to add emplyee', error})
    }

})

app.patch('/api/employees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } // return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(updatedEmployee); 
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete(`/api/employees/:id`, async (req,res) => {
  try{
    const id = req.params.id
    const deletedEmployee = await Employee.findByIdAndDelete(
      id
    )
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message : "deleted successfully"})
  }
  catch(err){
    console.error('delete error',err);
    res.status(500).json({message : 'error'})
    
  }
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
