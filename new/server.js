const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Port number for the server
const HF_API_KEY = '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'; // Your Hugging Face API key

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file when visiting the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'des.html'), (err) => {
        if (err) {
            console.error('Error serving HTML file:', err);
            res.status(500).send('Error loading the HTML file.');
        }
    });
});

// API endpoint for handling user queries
app.post('/getDiagnosis', async (req, res) => {
    const { query } = req.body; // Extract the user query from the request body

    if (!query) {
        return res.status(400).json({ answer: 'Please provide a query.' });
    }

    try {
        // Make a POST request to Hugging Face's GPT-2 model
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2', // Hugging Face model endpoint
            { inputs: query }, // User query passed as input
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`, // Pass the API key in the Authorization header
                },
            }
        );

        console.log('Hugging Face response:', response.data); // Log the API response for debugging

        const botResponse = response.data[0]?.generated_text || "Sorry, I couldn't understand your question."; // Extract the response
        res.json({ answer: botResponse }); // Send the response back to the frontend
    } catch (error) {
        console.error('Error fetching from Hugging Face API:', error);
        res.status(500).json({ answer: 'Error fetching response from Hugging Face API.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
