import React, { useEffect } from "react";
import "./App.css";
import "./Chat/Chat.css";

import LoginWindow from "./Chat/LoginWindow";
import ChatWindow from "./Chat/ChatWindow";
import MessageInput from "./Chat/MessageInput";
import UserList from "./Chat/UserList";
import socket from "../socket";

function App() {
	useEffect(() => {
		window.addEventListener("focus", () => {
			document.querySelector("#messageInput")?.focus();
		});

		socket.emit("getMessages", 500);
	});

	return (
		<div id="app">
			<LoginWindow />

			<div id="wrapper">
				<ChatWindow />
				<MessageInput />
			</div>

			<UserList />
		</div>
	);
}

export default App;
