class Validators {
  // function to validate input - just basic type validation
  checkInput(input) {
    return Array.isArray(input.products) && input.products.length > 0 && 'x' in input.position && 'y' in input.position && 'z' in input.position;
  }
}

module.exports = new Validators()