const http = require("http");
const app = require("./app");
const PORT = 3000;

var server = http.createServer(app);

server.listen(PORT, () =>
  console.log(`Server running at http://127.0.0.1:${PORT}/`)
);
