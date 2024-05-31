const jwt = require('jsonwebtoken');
const config = require('../config/config');
const orderModel = require('../models/order')
const deliveryPartnerModel = require('../models/deliveryPartner')
async function assignDeliveryPartner() {
    let partners = await deliveryPartnerModel.find();
    const arr = [];

    partners.forEach(partner => {
        if (partner.deliveryStatus === 'Off') {
            arr.push(partner._id);
        }
    });

    if (arr.length > 0) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        console.log('Random Index:', randomIndex);
        console.log('Assigned Partner ID:', arr[randomIndex]);
        return arr[randomIndex]
    } else {
        return null
    }
}

module.exports = { assignDeliveryPartner }
