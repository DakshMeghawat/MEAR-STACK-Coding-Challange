// routes/api.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// Get all transactions
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch and initialize database with external data
router.get('/init-db', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(data);

        res.status(200).send('Database initialized with seed data.');
    } catch (error) {
        res.status(500).send('Error initializing database: ' + error.message);
    }
});

module.exports = router;
