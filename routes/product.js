const express = require('express');
const router = express.Router();
const config = require('../config/config')
const flash = require('connect-flash')
const productModel = require('../models/product')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const { isUserLoggedIn, calculateTotal } = require('../middleware/userhandler')
const socketIo = require('socket.io-client'); // Import socket.io-client library

// Set up Socket.IO client to connect to the server
const socket = socketIo('http://localhost:3000'); // Adjust the URL as needed

var orderNo = 0

router.get("/", async (req, res) => {
    let products = await productModel.find()
    res.render('food' , {products})
});

router.get("/cart", isUserLoggedIn ,(req, res)=>{
    res.render('cart')
})

router.get("/orderConfirmation", (req, res)=>{
    res.render('orderConfirmation')
})

router.get("/orderhistory", isUserLoggedIn , async (req, res)=>{
    let user = await userModel.findOne({ _id: req.user.userid }).populate('orderedHistory');
    res.render('historyofOrder', {user , calculateTotal})
})

router.post("/createOrder", isUserLoggedIn, async (req, res) => {
    try {
        orderNo += 1;
        let orderOfuser = await orderModel.create({
            orderedItems: req.body.orderedItems,
            user: req.user.userid,
            date: Date.now(),
            orderNo: orderNo
        });

        let user = await userModel.findOne({_id : req.user.userid});
        user.orderedHistory.push(orderOfuser._id);
        await user.save();

        // Emit a 'newOrder' event when a new order is created
        socket.emit('newOrder', { order : orderOfuser, user : user}); // Pass orderOfuser directly

        // Send a success response with the URL to redirect to
        res.status(200).json({ success: true, redirectTo: '/product/orderConfirmation' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});


router.post('/updateStatus', async (req, res)=>{
    let {orderId , status } = req.body
    let order = await orderModel.findOneAndUpdate({_id : orderId}, {status : status})
    res.redirect('/management')
})


if(config.env === 'development'){
    router.get('/addProduct', (req, res)=>{
        const message = req.flash('message')
        res.render('adminAddingProduct' , {message})
    })
}else{
    console.log('Buddy go gome')
}

if(config.env === 'development'){
    router.post('/createProduct', async (req, res)=>{
        let {name, description, price} = req.body
        let product = await productModel.create({
            fullname : name, 
            description : description,
            price : price
        })
        req.flash("message", "Product is Added")
        res.redirect('/product/addProduct')
    })
}

module.exports = router;
