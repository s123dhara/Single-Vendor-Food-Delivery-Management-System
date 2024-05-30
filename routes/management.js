const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const {calculateTotal } = require('../middleware/userhandler')


router.get("/", async (req, res) => {

    let today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set UTC hours, minutes, seconds, and milliseconds to 0 for accurate comparison

    // Get orders for today
    let orders = await orderModel.find({
        date: {
            $gte: today, // Greater than or equal to today
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow
        }
    }).populate('user');
    res.render('management' , {orders, calculateTotal})
});


module.exports = router