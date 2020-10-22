const fs = require("fs");
const http = require("http");
const url = require("url");
// for t.ex. building http server

/* FILE */

// synchronous version of file reading
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// // write file
// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   console.log("First level!");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written!!!");
//       });
//     });
//   });
// });

// console.log("Will read file!");

/* SERVER */
// request variable & response variable
// Here is the response we are going to send back.
// incoming request, sending reponse

// this code runs only once,

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      ;
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    console.log(cardsHtml);
    res.end(output);

    // Product page
  } else if (pathName === "/product") {
    res.end("This is the product");

    // API page
  } else if (pathName === "/api") {
    // fs.readFile("./dev-data/data.json");
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

// port can be 8000, 3000, 80
// localhost
// listing to incoming request
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
// once listen, terminal console never leave, because of event loop
