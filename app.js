const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


//import packages 
const path = require('path')
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {isUserLoggedIn} = require('./middleware/userhandler')
const config = require('./config/config')


//required lines
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Session middleware setup
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
}));

// Flash middleware setup
app.use(flash());
app.use(cookieParser())

//routes
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')


//acquire Routers
app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/logout", logoutRouter)

//db 
const db = require('./config/mongoose-connect')


app.get("/",(req, res)=>{
    let isLoggedIn = false;
    if (req.cookies.token) {
        try {
        let data = jwt.verify(req.cookies.token, config.JWT_SECRET_KEY);
        isLoggedIn = true;
        } catch (err) {
        // Invalid token, consider user as not logged in
    }
  }
    res.render('home',{isLoggedIn})
})

app.listen(PORT, ()=>{
    console.log(`Server is Running at https://localhost:${PORT}`)
})