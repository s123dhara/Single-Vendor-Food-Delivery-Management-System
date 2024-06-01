const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const deliveryPartnerModel = require('../models/deliveryPartner')
const orderModel = require('../models/order')

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


router.get('/deliveryon/:partnerId', async (req, res)=>{
    let partner = await deliveryPartnerModel.findOne({_id : req.params.partnerId}).populate('currentOrderId')

    res.render('deliveryPage', { partner })
}
)
router.post('/deliveryoff', async (req, res) => {
    try {
        let partner = await deliveryPartnerModel.findOne({ _id: req.body.partnerId }).populate('currentOrderId');
        console.log(partner.currentOrderId.orderStatus)
        if (!partner) {
            return res.status(404).json({ error: 'Delivery partner not found' });
        }
        partner.deliveryStatus = 'Off';
        partner.currentOrderId.orderStatus = 'delivered'
        await partner.currentOrderId.save()
        partner.currentOrderId = null;
        await partner.save()
        // let order = await orderModel.findOne({_id : partner.currentOrderId})
        await partner.save();
        res.json({ success: true }); // Send JSON response indicating success
    } catch (error) {
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
});


router.post('/assignId', async (req, res) => {
    let { orderId, assignedPartnerId } = req.body
    let partner = await deliveryPartnerModel.findOne({_id : assignedPartnerId})
    partner.currentOrderId = orderId
    partner.deliveryStatus = 'On'
    await partner.save()
})

module.exports = router