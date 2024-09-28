const express = require('express');
const app = express();
const contactsRoute = require('./routes/contacts');
const { swaggerUi, swaggerSpec } = require('./src/swagger'); //integrate swagger

//middleware to parse JSON
app.use(express.json());

//use the contacts routes
app.use('/contacts', contactsRoute);
//serve the swagger docs at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//set up the server
app.get('/', (req, res) => {
  res.send("Available routes: /contacts, /api-docs");
});
 
app.listen(process.env.PORT || 3000, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 3000));
});
