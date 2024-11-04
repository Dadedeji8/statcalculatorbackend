const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 5000;
const bodyParser = require('body-parser')
const historyRoute = require('./history');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const userRoute = require('./user')

//Set up default mongoose connection
const mongoDB = 'mongodb+srv://dadedeji8:Adedeji%4099@statisticalcalculator.flx8e.mongodb.net/?retryWrites=true&w=majority&appName=StatisticalCalculator';
mongoose.connect(mongoDB);


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));  // Handles form-encoded data
app.use(bodyParser.json());  // Handles JSON data
app.use('/history', historyRoute);
app.use('/user', userRoute)
app.use((req, res, next) => {
    const error = new Error('not founnd');
    error.status = 404;
    next(error);
})
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-request-Width, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({})
    }
    next()
}
)
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
app.listen(port, () => console.log(`listening on port ${port}!`));
module.exports = app