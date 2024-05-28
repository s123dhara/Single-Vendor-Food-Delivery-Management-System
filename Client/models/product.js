const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    fullname : {type : String},
    description : {type : String},
    price : {type : String},
    
});

module.exports = mongoose.model("product", productSchema);
