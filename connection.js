/*const dotenv = require("dotenv")

const {MongoClient} = require('mongodb'); //import mongodb client
async function main(){*/
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    //const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vgbfw.mongodb.net/mydatabase?retryWrites=true&w=majority&tls=true&ssl=true`;
 
    //create an instance for the mongodb client noe that we have the uri
    /*const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}*/
//implement the listDatabases function
/*
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

dotenv.config()

main().catch(console.error);

*/
const dotenv = require("dotenv");
const { MongoClient } = require('mongodb'); // Import MongoDB client

dotenv.config(); // Load environment variables

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details.
   */
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vgbfw.mongodb.net/mydatabase?retryWrites=true&w=majority`;

  // Configure SSL/TLS settings for MongoDB client
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // Enable TLS/SSL
    //tlsAllowInvalidCertificates: true, // Accept self-signed or invalid certificates (useful for testing)
    tlsInsecure: true, // Ensure the connection is secure
    //tlsCAFile: './path/to/ca.pem', // Optional: specify the Certificate Authority (CA) file if using custom CA
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);

  } catch (e) {
    console.error('Connection error:', e);
  } finally {
    // Close the client connection
    await client.close();
  }
}

// Implement the listDatabases function
async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

main().catch(console.error);
