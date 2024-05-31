const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const deliveryPartnerModel = require('../models/deliveryPartner')

router.get("/", (req, res) => {
    res.render('delivery')
});

router.get("/create", (req, res)=> {
    res.render('delivery')
})

router.post('/create', async (req, res) => {
    let {dname, email, password} = req.body
    let partner = await deliveryPartnerModel.create({
        fullname : dname, 
        email : email,
        password : password
    })

    res.redirect('/delivery')
})


module.exports = router