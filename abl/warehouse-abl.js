const Externals = require("../helpers/externals");

class WarehouseAbl {
  // function to resolve route based on array input
  async resolveRoute(products, position) {
    // Get positions of products from API call
    let results = await Promise.all(products.map((product) => {
      return Externals.getPositions(product);
    }));

    // Firstly, we will parse our output from API call and divide products into array
    // of objects, where every object represents one product. Every object has array
    // of locations of given product
    // we will use this productBuffer as buffer that will provide us actual needed
    // products and their locations
    // after picking product we simply remove it from buffer so we will spare time
    // during searching through buffer
    let parsedOutput = this.parseProductPositions(results);
    let productBuffer = { ...parsedOutput };

    // We will save actual position of our worker
    // Initial position is given in input
    let actualX = position.x
    let actualY = position.y
    let actualZ = position.z

    // prepare variables for output
    let totalDistance = 0;
    let pickingOrder = []

    // We will itterate through every product that we need to fill up
    // and get closest one to our last position
    // we will also count our way there
    for (let pick in parsedOutput) {
      // call function to get closest product to given location
      let closestProduct = this.getClosestProduct(actualX, actualY, actualZ, productBuffer);
      // save closest product to final output variable
      pickingOrder.push({ productId: closestProduct.productId, positionId: closestProduct.positionId })
      // set worker position to actual product
      actualX = closestProduct.x;
      actualY = closestProduct.y;
      actualZ = closestProduct.z;
      // calculate total distance
      totalDistance = totalDistance + closestProduct.totalDistance;
      // remove product from buffer
      delete productBuffer[closestProduct.productId]
    }
    // return output in requested format
    return { pickingOrder: pickingOrder, totalDistance: totalDistance };
  }

  // Just a simple parser from JSON
  parseProductPositions(productList) {
    const parsedResult = productList.map((item) => JSON.parse(item));
    // convert JSON format to our array of objects format
    return this.convertOutput(parsedResult);
  }

  // Function that will calculate closest product to actual coordinates
  getClosestProduct(initialX, initialY, initialZ, products) {
    let distances = []
    for (let productType in products) {
      // get distances to all products based on actual position
      products[productType].forEach((product) => {
        distances.push({
          totalDistance: Math.abs(product.x - initialX) + Math.abs(product.y - initialY) + Math.abs(product.z - initialZ),
          ...product
        })
      })
    }
    // sort distances of products by totalDistance to them
    distances.sort(function(a, b) {
      return a.totalDistance - b.totalDistance
    })
    // return the smallest one
    return distances[0];
  }

  // simple function to map products into object of arrays
  convertOutput(parsedResult) {
    let products = {}
    parsedResult.forEach((product) => {
      let productId = product[0].productId;
      products[productId] = product
    })
    return products;
  }
}

module.exports = new WarehouseAbl()