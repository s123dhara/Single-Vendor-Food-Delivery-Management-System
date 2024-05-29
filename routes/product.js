const express = require('express');
const router = express.Router();
const config = require('../config/config')
const flash = require('connect-flash')
const productModel = require('../models/product')

router.get("/", async (req, res) => {
    let products = await productModel.find()
    res.render('food' , {products})
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