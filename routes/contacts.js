const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const router = express.Router();

// MongoDB connection URI using environment variables
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vgbfw.mongodb.net/`;

async function connectMongo() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client;
    } catch (e) {
        console.error(e);
        throw e; // Rethrow the error to handle it in case of a failed connection
    }
}

// Example route to get contacts. removing 'contacts from the next line'
router.get('/', async (req, res) => {
    let client;

    try {
        client = await connectMongo();
        const database = client.db('users'); // users is my DB name in mongodb
        const contacts = database.collection('contacts');
        const result = await contacts.find({}).toArray(); // Find all contacts
        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to retrieve contacts" });
    } finally {
        if (client) {
            await client.close(); // Ensure client closes even in case of an error
        }
    }
});

module.exports = router;

