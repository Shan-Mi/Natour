// const fs = require("fs");

// setTimeout(() => console.log("Timer 1 finished"), 0);
// setImmediate(() => console.log("Immediate 1 finished"));

// fs.readFile("test-file.txt", () => {
//   console.log("I/O finished");
//   setTimeout(() => console.log("Timer 2 finished"), 0);
//   setTimeout(() => console.log("Timer 3 finished"), 3000);
//   setImmediate(() => console.log("Immediate 2 finished"));
// });

// console.log("Hello from the top-level code");

setTimeout(function(){
  console.log("----the first block after 3 sec.");
},3000);
console.log("Hello after 3000");
setTimeout(function(){
  console.log("-----the second block after 1 sec.");
},1000);
console.log("Hello after 1000");
setTimeout(function(){
  console.log("-----the third block after 2 sec.");
},2000);
console.log("Hello after 2000");
setTimeout(function(){
  console.log("-----the last block after 0 sec.");
},0);
console.log("End after 0");