// routes/api.js
const express = require('express');
const Transaction = require('../mern-challenge/models/transaction');
const router = express.Router();

// Helper function to get the month number from month name
const getMonthNumber = (month) => {
    const months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    return months[month] || -1;
};

// GET /api/transactions
// List all transactions with search and pagination
router.get('/transactions', async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;
        const monthNumber = getMonthNumber(month);

        // Filter by month
        const matchMonth = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] } };

        // Search filter
        const searchFilter = search ? {
            $or: [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { price: parseFloat(search) }
            ]
        } : {};

        // Combine filters
        const filter = { ...matchMonth, ...searchFilter };

        // Pagination options
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(perPage, 10)
        };

        // Find and paginate results
        const transactions = await Transaction.paginate(filter, options);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
    }
});

// GET /api/statistics
// Get statistics for the selected month
router.get('/statistics', async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = getMonthNumber(month);

        // Filter by month
        const filter = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] } };

        // Aggregate statistics
        const stats = await Transaction.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$price" },
                    totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
                    totalNotSoldItems: { $sum: { $cond: ["$sold", 0, 1] } }
                }
            }
        ]);

        if (stats.length > 0) {
            const { totalSales, totalSoldItems, totalNotSoldItems } = stats[0];
            res.json({ totalSales, totalSoldItems, totalNotSoldItems });
        } else {
            res.json({ totalSales: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics: ' + error.message });
    }
});

// GET /api/bar-chart
// Get price range distribution for the selected month
router.get('/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = getMonthNumber(month);

        // Filter by month
        const filter = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] } };

        // Price ranges
        const priceRanges = [
            { range: "0-100", min: 0, max: 100 },
            { range: "101-200", min: 101, max: 200 },
            { range: "201-300", min: 201, max: 300 },
            { range: "301-400", min: 301, max: 400 },
            { range: "401-500", min: 401, max: 500 },
            { range: "501-600", min: 501, max: 600 },
            { range: "601-700", min: 601, max: 700 },
            { range: "701-800", min: 701, max: 800 },
            { range: "801-900", min: 801, max: 900 },
            { range: "901-above", min: 901, max: Infinity }
        ];

        // Aggregate price ranges
        const barChartData = await Transaction.aggregate([
            { $match: filter },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "901-above",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        // Map to expected format
        const result = priceRanges.map(range => ({
            range: range.range,
            count: barChartData.find(b => b._id === range.range) ? barChartData.find(b => b._id === range.range).count : 0
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data: ' + error.message });
    }
});

// GET /api/pie-chart
// Get unique categories and the number of items for the selected month
router.get('/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = getMonthNumber(month);

        // Filter by month
        const filter = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber + 1] } };

        // Aggregate categories
        const pieChartData = await Transaction.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map to expected format
        const result = pieChartData.map(item => ({
            category: item._id,
            count: item.count
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data: ' + error.message });
    }
});

// GET /api/combined
// Get combined data from all the above APIs
router.get('/combined', async (req, res) => {
    try {
        const { month } = req.query;

        // Fetch data from other endpoints
        const transactionsResponse = await axios.get(`http://localhost:${process.env.PORT}/api/transactions?month=${month}`);
        const statisticsResponse = await axios.get(`http://localhost:${process.env.PORT}/api/statistics?month=${month}`);
        const barChartResponse = await axios.get(`http://localhost:${process.env.PORT}/api/bar-chart?month=${month}`);
        const pieChartResponse = await axios.get(`http://localhost:${process.env.PORT}/api/pie-chart?month=${month}`);

        const combinedData = {
            transactions: transactionsResponse.data,
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data
        };

        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data: ' + error.message });
    }
});

module.exports = router;
