const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


//import packages 
const path = require('path')




//routes
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')

//required lines
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



//acquire Routers
app.use("/signup", signupRouter)
app.use("/login", loginRouter)


app.get("/", (req, res)=>{
    res.render('home')
})

app.listen(PORT, ()=>{
    console.log(`Server is Running at https://localhost:${PORT}`)
})