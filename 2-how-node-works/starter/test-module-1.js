// // class declaration
// class Calculator {
//   add(a, b) {
//     return a + b;
//   }
//   multiply(a, b) {
//     return a * b;
//   }
//   DevSide(a, b) {
//     return a / b;
//   }
// }

// // use module.exports when we want to export one single value
// module.exports = Calculator;

module.exports = class {
  add(a, b) {
    return a + b;
  }
  multiply(a, b) {
    return a * b;
  }
  DevSide(a, b) {
    return a / b;
  }
};
