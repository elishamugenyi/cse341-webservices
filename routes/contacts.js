const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Include ObjectId for working with MongoDB document IDs
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve a list of contacts
 *     description: Retrieve a list of contacts from the database.
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The contact ID.
 *                     example: "60d1fbbf2e35f45a5c46eb44"
 *                   firstname:
 *                     type: string
 *                     description: The contact's first name.
 *                     example: "Tony"
 *                   lastname:
 *                     type: string
 *                     description: The contact's last name.
 *                     example: "Stark"
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Create a new contact with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The contact's first name.
 *               lastname:
 *                 type: string
 *                 description: The contact's last name.
 *               email:
 *                 type: string
 *                 description: The contact's email address.
 *               phone:
 *                 type: string
 *                 description: The contact's phone number.
 *     responses:
 *       201:
 *         description: Contact created successfully.
 */


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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     description: Update an existing contact's information based on the provided contact ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to update.
 *         schema:
 *           type: string
 *           example: "60d1fbbf2e35f45a5c46eb44"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The updated first name of the contact.
 *                 example: "Clark"
 *               lastname:
 *                 type: string
 *                 description: The updated last name of the contact.
 *                 example: "Kent"
 *               email:
 *                 type: string
 *                 description: The updated email address of the contact.
 *                 example: "clark.kent@dailyplanet.com"
 *               phone:
 *                 type: string
 *                 description: The updated phone number of the contact.
 *                 example: "+1-987-654-3210"
 *     responses:
 *       200:
 *         description: Contact updated successfully.
 */

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

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     description: Delete an existing contact based on the provided contact ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contact to delete.
 *         schema:
 *           type: string
 *           example: "60d1fbbf2e35f45a5c46eb44"
 *     responses:
 *       200:
 *         description: Contact deleted successfully.
 */

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

