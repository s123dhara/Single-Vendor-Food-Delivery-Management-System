const express = require('express');
const router = express.Router();



router.get("/",(req, res) => {
    res.render('food')
});


module.exports = router