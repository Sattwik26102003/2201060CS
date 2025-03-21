require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;
const WINDOW_SIZE = parseInt(process.env.WINDOW_SIZE, 10);
const windowStore = [];

const API_URLS = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/fibo',
    r: 'http://20.244.56.144/test/rand'
};

const fetchNumbers = async (url) => {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
};

const updateWindow = (newNumbers) => {
    const uniqueNumbers = [...new Set(newNumbers)].filter(n => !windowStore.includes(n));
    windowStore.push(...uniqueNumbers);
    while (windowStore.length > WINDOW_SIZE) windowStore.shift();
};

const calculateAverage = () => {
    if (!windowStore.length) return 0;
    return parseFloat((windowStore.reduce((sum, num) => sum + num, 0) / windowStore.length).toFixed(2));
};
