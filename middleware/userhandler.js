const jwt = require('jsonwebtoken');
const config = require('../config/config');
const orderModel = require('../models/order')

function isUserLoggedIn(req, res, next) {
    const token = req.cookies.token;

    // Check if the token is undefined or an empty string
    if (!token) {
        return res.redirect("/login"); // Redirect to login if token is not present
    }

    try {
        const data = jwt.verify(token, config.JWT_SECRET_KEY);
        console.log("data ", data);
        req.user = data; // Correctly assign the verified data to req.user
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.redirect("/login"); // Redirect to login on verification failure
    }
}


function calculateTotal(orderedItems) {
    let total = 0;
    // Iterate over each ordered item
    orderedItems.forEach(item => {
        // Add the price of each item to the total
        total += item.price * item.quantity;
    });
    // Return the total charge
    return total.toFixed(2); // Ensure the total is formatted with two decimal places
}

module.exports = { isUserLoggedIn , calculateTotal};
