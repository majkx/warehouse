const express = require('express')
const https = require('https');
const app = express();
const port = 3000;

// constants for external api call
const baseUrl = 'https://dev.aux.boxpi.com/case-study/products/';
const apiKey = 'MVGBMS0VQI555bTery9qJ91BfUpi53N24SkKMf9Z';

const options = {
  headers: {
    'x-api-key': apiKey
  }
};

// create API listener on given port
app.listen(port, () => {
    console.log("Server beží na porte " + port + "\r\n | použi API call /getRoute")
})

// allow to read request body
app.use(express.json());

// create api listener for getRoute
app.post('/getRoute', (req, res) => {
    let input = req.body.input;
    // check and verify if input is array
    if(checkInput(input)){
    // resolve route based on input
    resolveRoute(input)
      .then((result) => {
        const parsedResult = result.map((item) => JSON.parse(item));
        res.send(parsedResult[0]);
      })
      .catch((error) => {
        res.status(500).send('Chyba pri volaní API : [' + error + ']');
      });
    }
    // if input is not valid, print error into console
    else console.error("Zly typ vstupu ! Vstup si vyzaduje pole s viac ako 1 prvkom ex.: ['product-1']");
  });

// function to resolve route based on array input
function resolveRoute(input){
    let warehousePositions =  new Promise((resolve, reject) => {
        let promises = []
        input.forEach((product) => {
            promises.push(new Promise((resolve,reject) => {
                resolve(getPositions(product))
            }))
        })
        let results = Promise.all(promises)
        resolve(results);
    })

    return warehousePositions;
}

// function to validate input - just basic type validation
function checkInput(input){
    if(Array.isArray(input) && input.length > 0) return true;
    return false;
}

// function to call api and get positions of products 
function getPositions(product) {
    let url = baseUrl + product + "/positions"
  return new Promise((resolve, reject) => {
    https.get(url, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}