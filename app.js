import express, { json } from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';


const app = express();
app.use(json());
app.use(express.static('Public'));

let APIKEY = process.env;

app.post('/chat', async (req, res) => {
    // Send request to OpenAI API
    // Handle response and send back to frontend
    const userMessage = req.body.message;

    try {
        console.log(APIKEY.OPEN_AI_URL);
        const response = await fetch(APIKEY.OPEN_AI_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${APIKEY.OPEN_AI_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages:[{ role: "system", content: "Technical Support for company named Cerebrum Lux that make website, mobile application and videos for clients. Your goal is to convert the user into a potential client and to book a meeting with them. Have small but concise answers" }, 
                { role: "user", content: userMessage}],
                max_tokens: 100,      // Maximum length of the response
            })
        });

        const data = await response.json();
        // Send the GPT-3 response back to the client
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error while communicating with OpenAI:', error);
        res.status(500).json({ error: 'Error processing the message' });
    }
});

// Start server
// Démarrage du serveur
app.listen(3000);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:3000`);