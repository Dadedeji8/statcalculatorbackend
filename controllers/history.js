const express = require('express');
const router = express.Router();
const History = require('../models/history.js');

// create new history
router.post('/', (req, res) => {
    res.send('create new history')
})