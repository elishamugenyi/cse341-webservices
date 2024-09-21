const express = require('express');
const app = express();
const contactsRoute = require('./routes/contacts');

//middleware to parse JSON
app.use(express.json());

//use the contacts routes
app.use('/contacts', contactsRoute);

//set up the server
//app.get('/', (req, res) => {
//  res.send("Hello, welcome to the first API");
//});
 
app.listen(process.env.PORT || 3000, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 3000));
});
