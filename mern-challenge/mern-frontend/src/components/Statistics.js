// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await axios.get(`http://localhost:5000/api/statistics?month=${selectedMonth}`);
            setStatistics(response.data);
        };

        fetchStatistics();
    }, [selectedMonth]);

    return (
        <div>
            <h2>Statistics for {selectedMonth}</h2>
            <ul>
                <li>Total Sales: {statistics.totalSales}</li>
                <li>Average Price: {statistics.averagePrice}</li>
                <li>Number of Transactions: {statistics.transactionCount}</li>
            </ul>
        </div>
    );
};

export default Statistics;
