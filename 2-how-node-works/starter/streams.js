const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // solution 2: streams
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk); // response is a writable stream
  // });
  // readable.on("end", () => {
  //   res.end();
  // });

  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found!");
  // });

  // solution 3: pipe
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res)
  // pattern: 1) readableSource, 2) pipe
  // readableSource.pipe(writeabledestidnation)
  // 🔺 come from; 
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
