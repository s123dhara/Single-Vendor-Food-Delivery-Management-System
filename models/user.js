const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    cart: {
        type: Array,
        default: [],
    },
    orderedHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order" // This should be consistent with the order model's name
    }
});

module.exports = mongoose.model("user", userSchema);
