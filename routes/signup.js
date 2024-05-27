const express = require('express')
const router = express.Router()
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

router.get("/", (req, res)=>{
    const error = req.flash("error");
    res.render('signup', {error})
})

router.post("/create", async (req, res) => {
    let { fullname, email, password, contact } = req.body;

    try {
        let user = await userModel.findOne({ email: email });

        if (!user) {
            // Generate salt and hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            user = await userModel.create({
                fullname: fullname,
                email: email,
                password: hashedPassword,
                contact: contact
            });

            res.redirect('/');
        } else {
            req.flash("error", "User Already Exists");
            res.redirect("/signup");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Error");
    }
});


module.exports = router