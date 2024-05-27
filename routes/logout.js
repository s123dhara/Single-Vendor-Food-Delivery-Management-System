const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')


router.get("/",(req, res) => {
    res.cookie("token", "")
    res.redirect("/")
});


module.exports = router