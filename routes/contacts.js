const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Include ObjectId for working with MongoDB document IDs
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

// GET: Retrieve all contacts
router.get('/', async (req, res) => {
  let client;

  try {
    client = await connectMongo();
    const database = client.db('users'); // Use your 'users' database
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

// POST: Create a new contact
router.post('/', async (req, res) => {
  let client;

  try {
    client = await connectMongo();
    const database = client.db('users');
    const contacts = database.collection('contacts');

    // Create a new contact with required fields
    const newContact = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday 
      // Add other fields as needed
    };

    // Insert the new contact into the database
    const result = await contacts.insertOne(newContact);

    res.status(201).json({ message: 'Contact created successfully', id: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create contact', error: e });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// PUT: Update an existing contact by ID
router.put('/:id', async (req, res) => {
  let client;
  const contactId = req.params.id;

  try {
    client = await connectMongo();
    const database = client.db('users');
    const contacts = database.collection('contacts');

    // Update the contact based on the provided ID and request body
    const updatedContact = {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
        // Add other fields as needed
      },
    };

    // Find the contact by ID and update it
    const result = await contacts.updateOne(
      { _id: new ObjectId(contactId) },
      updatedContact
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update contact', error: e });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

// DELETE: Remove a contact by ID
router.delete('/:id', async (req, res) => {
  let client;
  const contactId = req.params.id;

  try {
    client = await connectMongo();
    const database = client.db('users');
    const contacts = database.collection('contacts');

    // Find and delete the contact by ID
    const result = await contacts.deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete contact', error: e });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

module.exports = router;
