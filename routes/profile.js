const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const {isUserLoggedIn} = require('../middleware/userhandler')
const userModel = require('../models/user')


router.get("/",  isUserLoggedIn , async ( req ,res) => {

    // console.log(req.user)
    let user = await userModel.findOne({ _id : req.user.userid})

    res.render('profile' , {user})
});


module.exports = router