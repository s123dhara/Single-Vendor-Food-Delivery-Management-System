const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" // This should match the user model's name
    },
    date: {
        type: Date, // Changed from `Date` to `date` to follow camelCase convention
    },
    orderedItems : {
        type : Array,
        default : []
    }
});

module.exports = mongoose.model("order", orderSchema);
