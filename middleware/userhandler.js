const jwt = require('jsonwebtoken');
const config = require('../config/config');

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

module.exports = { isUserLoggedIn };
