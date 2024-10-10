const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio Credentials (replace with your actual Twilio credentials)
const accountSid = 'AC802be7fe51f92edb3aa4d63af6cb65c3'; // Replace with your Twilio Account SID
const authToken = '274f0037bb2c4edd34a39aeab08f0af6';   // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Ensure 'public' folder contains index.html and style.css

// Hardcoded emergency contacts
const emergencyContacts = [
    { name: 'John Doe', phoneNumber: '+917340165640' }, // Replace with actual phone numbers
    { name: 'Jane Smith', phoneNumber: '+919149416978' },
    // Add more contacts as needed
];

// Route to handle SMS sending
app.post('/send-sms', (req, res) => {
    const { bp, bloodSugar, heartRate, symptoms } = req.body;

    // Validate input data
    if (!bp || !bloodSugar || !heartRate || !symptoms) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Prepare the message content
    const message = `Emergency Alert!\nHealth Details:\nBlood Pressure: ${bp}\nBlood Sugar Level: ${bloodSugar}\nHeart Rate: ${heartRate}\nSymptoms: ${symptoms}`;

    // Send SMS to each emergency contact
    Promise.all(emergencyContacts.map(contact => {
        return client.messages.create({
            body: message,
            from: '+12088377539',  // Replace with your Twilio phone number
            to: contact.phoneNumber
        })
        .then(message => console.log(`SMS sent to ${contact.phoneNumber} with SID: ${message.sid}`))
        .catch(error => console.error(`Failed to send SMS to ${contact.phoneNumber}:`, error));
    }))
    .then(() => {
        res.json({ message: 'SMS sent to emergency contacts!' });
    })
    .catch(err => {
        console.error('Error sending SMS:', err);
        res.status(500).json({ message: 'Error sending SMS' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
