const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" // This should match the user model's name
    },
    orderNo : {
        type : Number,
        default : 0
    },
    date: {
        type: Date, // Changed from `Date` to `date` to follow camelCase convention
    },
    orderedItems : {
        type : Array,
        default : []
    },

    orderStatus : {type : String}

});

module.exports = mongoose.model("order", orderSchema);
