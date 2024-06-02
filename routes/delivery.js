const express = require('express');
const router = express.Router();
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const deliveryPartnerModel = require('../models/deliveryPartner')
const orderModel = require('../models/order')
const flash = require('connect-flash')
// const session = require('express-session');

// const app = express();

// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: false
// })); 

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
        partner.currentOrderNo = -1
        await partner.save()
        res.json({ success: true }); // Send JSON response indicating success
    } catch (error) {
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
});

router.get('/deliveryCRM/:partnerId', async (req, res) => { 
    try {
        let isOrder = false
        let partner = await deliveryPartnerModel.findOne({ _id : req.params.partnerId }).populate('currentOrderId');

        if(partner.currentOrderNo !== -1){
            isOrder = true
        }

        res.render('deliveryCRM', { partner, isOrder });
    } catch (error) {
        console.error("Error rendering deliveryCRM:", error);
        res.status(500).send("Error rendering deliveryCRM");
    }
});


router.post('/assignId', async (req, res) => {
    try {
        let { orderId, assignedPartnerId } = req.body;
        let partner = await deliveryPartnerModel.findOne({ _id: assignedPartnerId });
        let order = await orderModel.findOne({ _id: orderId });
        partner.currentOrderId = order._id;
        partner.currentOrderNo = order.orderNo;
        partner.deliveryStatus = 'On';
        await partner.save();
        
        req.session.isOrderAssigned = true; // Set session variable
        res.sendStatus(200); // Send a success response
    } catch (error) {
        console.error("Error assigning ID:", error);
        res.status(500).send("Error assigning ID");
    }
});

// router.post('/clearSession', (req, res) => {
//     console.log('chck req.body : ',req.body)
//     const page = req.body.page;
//     if (page === 'deliveryCRM/:partnerId') {
//         req.session.destroy((err) => {
//             if (err) {
//                 console.error("Error destroying session:", err);
//                 res.status(500).send("Error destroying session");
//             } else {
//                 res.sendStatus(200);
//             }
//         });
//     } else {
//         res.status(400).send("Invalid page");
//     }
// });


module.exports = router