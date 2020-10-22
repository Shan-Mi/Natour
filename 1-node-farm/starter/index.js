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
const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the overview");
  } else if (pathName === "/product") {
    res.end("This is the product");
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header':
    })
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
