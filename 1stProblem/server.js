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

let authToken = "";
const fetchAuthToken = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: "IIIT Bhagalpur",
            clientID: "a33d4f07-8d98-4bee-8fc0-94fc36ee8675",
            clientSecret: "vshQdhLLaXWErYLk",
            ownerName: "Sattwik Bhakta",
            ownerEmail: "sattwik.2201060cs@iiitbh.ac.in",
            rollNo: "2201060CS"
        });

        authToken = response.data.access_token;
        console.log("Authentication Token:", authToken);
    } catch (error) {
        console.error("Error fetching auth token:", error.response?.data || error.message);
    }
};

const fetchNumbers = async (url) => {
    try {
        const response = await axios.get(url, { headers: { Authorization: `Bearer ${authToken}` },timeout: 500 });
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

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    if (!API_URLS[numberid]) return res.status(400).json({ error: 'Invalid number ID' });
    
    const prevState = [...windowStore];
    const newNumbers = await fetchNumbers(API_URLS[numberid]);
    updateWindow(newNumbers);
    
    res.json({
        windowPrevState: prevState,
        windowCurrState: [...windowStore],
        numbers: newNumbers,
        avg: calculateAverage()
    });
});

fetchAuthToken().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});