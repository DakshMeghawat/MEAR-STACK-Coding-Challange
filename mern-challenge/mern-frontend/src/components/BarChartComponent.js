// src/components/BarChartComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ selectedMonth }) => {
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        const fetchBarChartData = async () => {
            const response = await axios.get(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`);
            setBarChartData(response.data);
        };

        fetchBarChartData();
    }, [selectedMonth]);

    return (
        <div>
            <h2>Bar Chart for {selectedMonth}</h2>
            <BarChart width={600} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default BarChartComponent;
