import React, { useEffect } from "react";

import "./App.css";
import "./Chat/Chat.css";

import LoginWindow from "./Chat/LoginWindow";
import ImagePreview from "./Chat/ImagePreview";
import ChatWindow from "./Chat/ChatWindow";
import MessageInput from "./Chat/MessageInput";
import UserList from "./Chat/UserList";
import socket from "../socket";

function App() {
	if (!window.localStorage.getItem("user")) {
		const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		const token = Array(16).fill(0).map(() => charset[Math.floor(Math.random() * charset.length)]).join("");
		const user = { token, nickname: "" };

		window.localStorage.setItem("user", JSON.stringify(user));
	}

	useEffect(() => {
		window.addEventListener("focus", () => {
			document.querySelector("#messageInput")?.focus();
		});

		socket.emit("getMessages", 500);
	}, []);

	return (
		<div id="app">
			<LoginWindow />
			<ImagePreview />

			<div id="mainWrapper">
				<ChatWindow />
				<MessageInput />
			</div>

			<UserList />
		</div>
	);
}

export default App;
