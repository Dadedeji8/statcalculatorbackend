const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const historyRoute = require('./routes/history');
const userRoute = require('./routes/user');

const app = express();
const port = 6000;

// MongoDB connection URI from environment variables
const mongoDB = 'mongodb+srv://dadedeji8:Adedeji99@statisticalcalculator.flx8e.mongodb.net/?retryWrites=true&w=majority&appName=StatisticalCalculator'
// Connect to MongoDB
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on('connected', () => console.log('MongoDB connected successfully.'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', () => console.log('MongoDB disconnected.'));

// Middleware setup
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Replaces body-parser for URL-encoded form data
app.use(
    cors({
        origin: "*",
    })
);

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/history', historyRoute);
app.use('/api/user', userRoute);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is alive lol' });
})

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is alive' });
});
// 404 Not Found handler
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            location: 'Error handler: it failed all routes and ended up here'
        }
    });
});

// Start server
app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;
