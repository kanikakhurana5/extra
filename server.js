const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'des.html'));
});

// Initialize OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route for getting diagnosis
app.post('/getDiagnosis', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ answer: 'Please provide a question.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
        });

        res.json({ answer: response.choices[0].message.content });
    } catch (error) {
        console.error('Error fetching response:', error);
        res.status(500).json({ answer: 'Error fetching response from OpenAI API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

