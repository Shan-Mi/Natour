// This is a class, then we are going to create instances of it.
const EventEmitter = require("events");

// class Sales inherits everything from EventEmitter
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("There was a new sale");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Shan");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});
// myEmitter.emit("newSale");
// This is observer pattern.
// emit an event -> two ons are observers
// they observer the emitter and wait
// until it emits the newSale event

// It can take a second argument
// can use the second parameter in the cb function as the 2nd argument
myEmitter.emit("newSale", 99);
