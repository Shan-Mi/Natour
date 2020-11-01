// console.log(arguments);
// console.log(require('module').wrapper)

// 1. module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 9));

// 2. exports
// const calc2 = require("./test-module-2");
// console.log(calc2.add(2, 5));

// common use!!
const { add, multiply, devide } = require("./test-module-2");
console.log(add(2, 5));

// 3. Caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
