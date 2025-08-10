const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
// const processPayloads = require("./scripts/processPayloads");
const messageRoute = require("./routes/messages");

const port = process.env.PORT;
const allowedOrigin = process.env.ALLOWED_ORIGIN;

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
); // CORS middleware
app.use(express.json()); // express.json middleware
app.use(cookieParser()); // cookie-parser middleware

// router middlewares
app.use('/api', messageRoute);
// app.post('/api/process-payloads', async (req, res) => {
//     try {
//         console.log('Received request to process payloads...');
//         await processPayloads();
//         res.status(200).json({ success: true, message: 'Payloads processed successfully.' });
//     } catch (error) {
//         console.error('Failed to process payloads:', error);
//         res.status(500).json({ success: false, message: 'An error occurred while processing payloads.' });
//     }
// });

connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(port, () => {
            console.log(`project starting on port ${port}....`);
        });
    })
    .catch((err) => {
        console.log("Database cannot be connected : " + err);
    });