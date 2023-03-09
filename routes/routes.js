const express = require('express');

const router = express.Router();
const Movie = require('../model/movieModel');

//Post Method
router.post('/post', async (req, res) => {
    const data = new Movie({
        name: req.body.name,
        released_on: req.body.released_on
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const data = await Movie.find({}).limit(pageSize).skip(pageSize * page);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Movie.findById(req.params.id);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = {new: true};

        const result = await Movie.findByIdAndUpdate(
            id, updatedData, options
        );

        res.send(result);
    }
    catch(error) {
        res.status(400).json({message: error.message})
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Movie.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted`);
    }
    catch(error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router;