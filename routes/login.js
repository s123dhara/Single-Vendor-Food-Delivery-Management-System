const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const config = require('../config/config')
const jwt = require('jsonwebtoken')


router.get("/",(req, res) => {
    const error = req.flash("error");
    res.render('login', { error });
});

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (user) {
            const result = await bcrypt.compare(password, user.password); // Await bcrypt.compare

            if (result) {
                // Create JWT token
                const token = jwt.sign(
                    { email: email, userid: user._id },
                    config.JWT_SECRET_KEY, // Use the secret key from the config file
                    { expiresIn: '1h' } // Optional: Set token expiration time
                );

                // Set the token as a cookie
                res.cookie('token', token, { httpOnly: true });
                res.status(201).send("Authenticated User");

            } else {
                req.flash("error", "Invalid Email or Password");
                res.redirect('/login');
            }
        } else {
            req.flash("error", "Email ID does not exist");
            res.redirect("/login");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
