const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    contact: {
        type: Number,
    },
    product: {
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model("shop", shopSchema);
