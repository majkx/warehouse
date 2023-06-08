const express = require('express')
const Validators = require("./helpers/validators")
const WarehouseAbl = require("./abl/warehouse-abl")
const app = express();
const port = 3000;

// create API listener on given port
app.listen(port, () => {
  console.log("Server beží na porte " + port + "\r\npouži API call /getRoute")
})

// allow to read request body
app.use(express.json());

// create api endpoint for getRoute
app.post('/getRoute', (req, res) => {
  let input = req.body;
  // check and verify if input is array
  if (Validators.checkInput(input)) {
    // resolve route based on input
    WarehouseAbl.resolveRoute(input.products, input.position)
      .then((result) => {
        res.send(result)
      })
      .catch((error) => {
        res.status(500).send('Chyba pri volaní API : [' + error + ']');
      });
  }
  // if input is not valid, print error into console
  else {
    console.error("Zly typ vstupu !");
  }
});






