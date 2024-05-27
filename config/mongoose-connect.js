const moongoose = require('mongoose')

moongoose.connect("mongodb://127.0.0.1:27017/foodApp")
.then(res =>{
    console.log("Database Connected")
})
.catch(err =>{
    console.log("NO connection!")
})


module.exports = moongoose.connection