const express = require('express');
const router = express.Router();
const config = require('../config/config')
const flash = require('connect-flash')
const productModel = require('../models/product')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const { isUserLoggedIn, calculateTotal } = require('../middleware/userhandler')

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
        let orderOfuser = await orderModel.create({
            orderedItems: req.body.orderedItems,
            user: req.user.userid,
            date: Date.now()
        });

        let user = await userModel.findOne({_id : req.user.userid})
        user.orderedHistory.push(orderOfuser._id)
        await user.save()

        // Send a success response with the URL to redirect to
        res.status(200).json({ success: true, redirectTo: '/product/orderConfirmation' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});



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




module.exports = router