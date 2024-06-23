// src/components/PieChartComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ selectedMonth }) => {
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        const fetchPieChartData = async () => {
            const response = await axios.get(`http://localhost:5000/api/pie-chart?month=${selectedMonth}`);
            setPieChartData(response.data);
        };

        fetchPieChartData();
    }, [selectedMonth]);

    return (
        <div>
            <h2>Pie Chart for {selectedMonth}</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={pieChartData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default PieChartComponent;
