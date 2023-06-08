const https = require("https");
// constants for external api call
const baseUrl = 'https://dev.aux.boxpi.com/case-study/products/';
const apiKey = 'MVGBMS0VQI555bTery9qJ91BfUpi53N24SkKMf9Z';
const options = {
  headers: {
    'x-api-key': apiKey
  }
};

class Externals {

  getPositions(product) {
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

}

module.exports = new Externals();