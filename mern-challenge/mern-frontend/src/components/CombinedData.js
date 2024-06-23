// src/components/CombinedData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombinedData = ({ selectedMonth }) => {
    const [combinedData, setCombinedData] = useState({});

    useEffect(() => {
        const fetchCombinedData = async () => {
            const response = await axios.get(`http://localhost:5000/api/combined-data?month=${selectedMonth}`);
            setCombinedData(response.data);
        };

        fetchCombinedData();
    }, [selectedMonth]);

    return (
        <div>
            <h2>Combined Data for {selectedMonth}</h2>
            <pre>{JSON.stringify(combinedData, null, 2)}</pre>
        </div>
    );
};

export default CombinedData;
