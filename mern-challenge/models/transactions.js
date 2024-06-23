// models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    product_id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    quantity: Number,
    dateOfSale: Date,
    sold: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
