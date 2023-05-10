const express = require('express');
const router = express.Router()
const Model = require('../models/model');


//Post Method
// router.post('/post', (req, res) => {
//     res.send('Post API')
// })

//Get all Method
// router.get('/getAll', (req, res) => {
//     res.send('Get All API')
// })

//Get by ID Method
// router.get('/getOne/:id', (req, res) => {
//     res.send(req.params.id)
// })

//Update by ID Method
// router.patch('/update/:id', (req, res) => {
//     res.send('Update by ID API')
// })

//Delete by ID Method
// router.delete('/delete/:id', (req, res) => {
//     res.send('Delete by ID API')
// })
//Posting data based on model(In this case we post the name with age)
router.post('/post', async (req, res) => {
    const data = new Model({
        name: "Paulius",
        age: 23
    })

    try {
        const dataToSave = await data.save(); //This saves the data in the database and stores it in a constant value
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})//We use res.status(XXX) to make the error catching and saving asynchronous, so it doesn't conflict when launching the server
    }
})
router.get('/getAll', async (req, res) => { //Get all of the saved collections in the database
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/getOneId/:id', async (req, res) => { //Find a specific data collection based on its ID
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => { 
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;

