import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
	opts: {
		cors: {
			origin: "*",
			methods: [ "GET", "POST" ]
		}
	}
});

const messages = [];
const users = [];

io.on("connection", socket => {
	let user = null;

	socket.on("getMessages", n => {
		socket.emit("messages", messages.slice(-n));
	});

	socket.on("getUsers", callback => {
		callback(users);
	});

	socket.on("login", (selfUser, callback) => {
		if (!selfUser
			|| typeof selfUser.token !== "string"
			|| typeof selfUser.nickname !== "string"
			|| users.some(u => u.nickname === selfUser.nickname)
		) {
			callback(null);
			return;
		}

		user = structuredClone(selfUser);
		users.push(user);

		const messageEntry = {
			timestamp: Date.now(),
			isSystem: true,
			message: `${user.nickname} joined the chat`
		};
		messages.push(messageEntry);

		io.emit("userAdded", messageEntry);

		callback(user);
	});

	socket.on("sendMessage", ({ message, image}) => {
		if (user === null) return;

		const messageEntry = {
			timestamp: Date.now(),
			isSystem: false,
			user,
			message,
			image
		};
		messages.push(messageEntry);

		io.emit("newMessage", messageEntry);
	});

	socket.on("deleteMessage", messageEntry => {
		if (user === null || messageEntry.isSystem) return;

		const timestamp = messageEntry.timestamp;
		if (!timestamp) return;

		const index = messages.findIndex(m => m.timestamp === timestamp);
		if (index === -1) return;

		const message = messages[index];
		if (message.isSystem || message.user.token !== user.token) return;

		messages.splice(index, 1);

		io.emit("messageDeleted", messageEntry);
	});

	socket.on("disconnect", reason => {
		const index = users.indexOf(user);
		if (index === -1) return;

		users.splice(index, 1);

		const messageEntry = {
			timestamp: Date.now(),
			isSystem: true,
			user,
			message: `${user.nickname} left the chat`
		};
		messages.push(messageEntry);

		io.emit("userRemoved", messageEntry);
	});
});

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
