// Port
const webSocketServerPort = 8080;
// Loading the server
const webSocketServer = require("websocket").server;
// Loading HTTP
const http = require("http");

const server = http.createServer();
server.listen(webSocketServerPort);
console.log(`listening to port ${webSocketServerPort}`);

// Spawn a webSocket server using the instance
// of the HTTP server we created
const wsServer = new webSocketServer({
	httpServer: server,
});

// Where to store all connected clients
const clients = {};

// Define the request method for
// the webSockets server and
// what to do with tha request
wsServer.on("request", function (req) {
	var userID = getUniqueID();
	// log the new connection request
	console.log(`${new Date()} Recieved a new connection from origin ${req.origin}.`);

	//accept the new connection request
	//todo: filter request to only allowed origins
	console.log("request", req);
	const connection = req.accept(null, req.origin);

	// add the new connection to the clients list
	clients[userID] = connection;

	//log the new user in the connection list
	console.log(`connected: ${userID} in ${Object.getOwnPropertyDescriptor(clients[userID])}`);

	// message handler
	connection.on("message", function (msg) {
		console.log(msg);
		if (msg.type === "utf8") {
			console.log("Received Msg:", msg.utf8Data);
			let themsg = JSON.parse(msg.utf8Data);
			console.log(themsg);
			// broadcast the message to all connected clients
			if (themsg.identifier == undefined || themsg.identifier != "notice") {
				for (key in clients) {
					clients[key].sendUTF(JSON.stringify(themsg));
					// console.log("Sent message to :", clients);
				}
			}
		}
	});
});

// Generate a Unique ID
const getUniqueID = () => {
	const us4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return us4() + us4() + "-" + us4();
};
