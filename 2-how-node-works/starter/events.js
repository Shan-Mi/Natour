// This is a class, then we are going to create instances of it.
const EventEmitter = require("events");

const http = require("http");
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

/* new examples */

const server = http.createServer();

// on: this code is listening for an event
server.on("request", (req, res) => {
  console.log("Request received");
  console.log(req.url);
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request received 😻 ");
});

server.on("close", () => {
  console.log("Server closed");
});

// Start server, port / address / cb(optional)
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});

/* we emit events by using event emitter on our own,*/