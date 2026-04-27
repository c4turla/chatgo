import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
