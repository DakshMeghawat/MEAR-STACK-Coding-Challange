// models/transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    status: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
