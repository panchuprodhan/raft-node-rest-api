const express = require('express');

const router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 10)
    });

    try {
        const userSave = await user.save();
        res.status(200).json(userSave);
    } catch (error){
        res.status(400).json({message: error.message})
    }
});

router.post('/authenticate', async(req, res) => {
    const userInfo = await User.findOne({email: req.body.email}).exec();

    try {
        if(bcrypt.compareSync(req.body.password, userInfo.password)) {
            const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
            
            res.status(200).json({ message: "user found!!!", data:{user: userInfo, token:token}});
        } else {
            res.status(400).json({message: "Invalid email/password"});
        }
    } catch (error) {
        res.json({message: error.message});
    }
})

module.exports = router;