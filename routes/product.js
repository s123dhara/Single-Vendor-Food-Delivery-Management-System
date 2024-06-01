const express = require('express');
const router = express.Router();
const config = require('../config/config')
const flash = require('connect-flash')
const productModel = require('../models/product')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const deliveryPartnerModel = require('../models/deliveryPartner')
const { isUserLoggedIn, calculateTotal } = require('../middleware/userhandler')
const {assignDeliveryPartner } = require('../middleware/adminhandler')
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

router.get('/orders/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    // Find the order with the specified orderId
    const order = await orderModel.findOne({_id : orderId});
    if (!order) {
        // If order not found, return 404 Not Found status
        res.status(404).send('Order not found');
    } else {
        // If order found, return the order details as JSON
        res.json(order);
        // res.send(order)
    }
});
router.get('/delivery/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    // Call assignDeliveryPartner and wait for its result
    let possibleDelivery = await assignDeliveryPartner();

    if (possibleDelivery) {
        let partner = await deliveryPartnerModel.findOne({_id : possibleDelivery})
        res.json({ assignedPartnerId: possibleDelivery , partner : partner});

    } else {
        res.status(404).json({ assignedPartnerId : possibleDelivery, partner : null});
    }
});

router.post('/test', (req, res)=>{
    console.log('comming data from ', req.body)
    
    const data = {
        orderId : req.body.orderId,
        action : 'Out For Delivery'
    }

    socket.emit('OrderAction', data);
})

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
