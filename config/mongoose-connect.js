const moongoose = require('mongoose')

moongoose.connect("mongodb+srv://spdh427:wOw9EZoA4Ye47t8m@suprioy.jbdl4qj.mongodb.net/foodApp")
.then(res =>{
    console.log("Database Connected")
})
.catch(err =>{
    console.log("NO connection!")
})


module.exports = moongoose.connection