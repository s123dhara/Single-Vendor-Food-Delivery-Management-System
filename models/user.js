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
    orderedHistory: {

        type : [{ type: mongoose.Schema.Types.ObjectId,
            ref: "order" }],
        
            default : []
    }
});

module.exports = mongoose.model("user", userSchema);
