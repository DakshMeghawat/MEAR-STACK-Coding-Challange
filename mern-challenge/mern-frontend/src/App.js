// src/App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';
import CombinedData from './components/CombinedData';
import './App.css';

const App = () => {
    const [selectedMonth, setSelectedMonth] = useState('March');

    return (
        <div className="app">
            <header>
                <h1>Transaction Dashboard</h1>
                <label>
                    Select Month:
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {[
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December'
                        ].map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </label>
            </header>
            <main>
                <TransactionsTable selectedMonth={selectedMonth} />
                <Statistics selectedMonth={selectedMonth} />
                <BarChartComponent selectedMonth={selectedMonth} />
                <PieChartComponent selectedMonth={selectedMonth} />
                <CombinedData selectedMonth={selectedMonth} />
            </main>
        </div>
    );
};

export default App;
