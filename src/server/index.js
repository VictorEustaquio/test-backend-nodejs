"use strict";
const env = require("../config/dotenv"); //Start node enviroment variables from config file.
const port = normalizePort(env.server_port); //Initializing a normalized port for the server.
const app = require("../app/express_old.js"); //Import app;
const http = require("http"); //Import http interfaces;
const server = http.createServer(app);  //Instantiating the HTTP server for the app to listen for requests.
const debug = require("debug")("api:server");

server.listen(port);                  //Set port to server instance.
server.on("error", onError);          //Set onError handler.
server.on("listening", onListening);  //Set onListening handler.

/**
 * Server Functions
 * @function normalizePort   Normalize a port into a number, string, or false.
 * @function onError         Handle Error events.
 * @function onListening     Listen when the server is ready.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requer privilegio maior");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " já está em uso");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  const local_network_ip = network_ip["localnetwork"];
  debug("Listening on " + bind);
  console.log(`\n🚀 Server\n   |_ listening on port ${port} ✔️\n`);
  app.set("port", port);  //Setting normalized port to app.
  console.log(`🚀 App is running on...\n   |_ localhost: http://127.0.0.1:${port} ✔️\n   |_ localnetwork: http://${local_network_ip}:${port} ✔️\n`);
}


//Get local IP (optional)
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const network_ip = Object.create({});
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!network_ip[name]) network_ip[name] = new Array();
      network_ip["localnetwork"] = net.address;
      network_ip[name].push(net.address);
    }
  }
}
