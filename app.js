const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Import Socket.IO and create an instance with the HTTP server
const PORT = process.env.PORT || 3000;

// Import other required modules
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { isUserLoggedIn } = require('./middleware/userhandler');
const config = require('./config/config');
const orderModel = require('./models/order')

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use(cookieParser());

// Routes setup
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const productRouter = require('./routes/product');
const aboutRouter = require('./routes/about');
const managementRouter = require('./routes/management')
const deliveryRouter = require('./routes/delivery')

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
app.use('/product', productRouter);
app.use('/about', aboutRouter);
app.use('/management', managementRouter)
app.use('/delivery', deliveryRouter)

// Database connection
const db = require('./config/mongoose-connect');
const order = require('./models/order');

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for 'newOrder' event emitted from the client
    socket.on('newOrder', ({order, user}) => {
        // Broadcast the new order to all connected clients
        io.emit('newOrder', ({order, user}));
    });


    socket.on('orderAction', async (data) => {
        // console.log( ` data will be : ${data.action} and ${data.orderId}`)
        let order = await orderModel.findOne({_id : data.orderId})
        order.orderStatus = data.action
        await order.save()
        
        let orders = await orderModel.find()
        let pendingCount = 0
        orders.forEach( order => {
            if ( order.orderStatus === 'accept'){
                pendingCount += 1
            }
        })        
        io.emit('pendingCount' , pendingCount)
    })
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Home route
app.get('/', (req, res) => {
    let isLoggedIn = false;
    if (req.cookies.token) {
        try {
            let data = jwt.verify(req.cookies.token, config.JWT_SECRET_KEY);
            isLoggedIn = true;
        } catch (err) {
            // Invalid token, consider user as not logged in
        }
    }
    res.render('home', { isLoggedIn });
});

app.get('/exampl', async (req, res) => {
    // Get today's date
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set UTC hours, minutes, seconds, and milliseconds to 0 for accurate comparison

    // Get orders for today
    let orders = await orderModel.find({
        date: {
            $gte: today, // Greater than or equal to today
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow
        }
    });
    // Render the 'exampl' view with the found orders
    res.render('exampl', { orders: orders });
});


// Start the server
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
