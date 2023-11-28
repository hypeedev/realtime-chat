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
	const user = {
		id: Math.random().toString(16).slice(2),
		nickname: null
	};

	socket.on("getMessages", n => {
		socket.emit("messages", messages.slice(-n));
	});

	socket.on("getUsers", callback => {
		callback(users);
	});

	socket.on("setNickname", (newNickname, callback) => {
		if (users.some(u => u.nickname === newNickname)) {
			callback(false);
			return;
		}

		user.nickname = newNickname;

		users.push(user);

		const messageEntry = {
			timestamp: Date.now(),
			isSystem: true,
			user,
			message: `${user.nickname} joined the chat`
		};
		messages.push(messageEntry);

		io.emit("userAdded", messageEntry);

		callback(true);
	});

	socket.on("sendMessage", message => {
		const nickname = user.nickname;
		if (nickname === null) return;

		const messageEntry = {
			timestamp: Date.now(),
			isSystem: false,
			user,
			message
		};
		messages.push(messageEntry);

		io.emit("newMessage", messageEntry);
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
