import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

import MessageEntry from "./MessageEntry";

function ChatWindow() {
	const [ messages, setMessages ] = useState([]);
	const [ userScrolled, setUserScrolled ] = useState(false);

	useEffect(() => {
		function handleScroll() {
			if (userScrolled) return;
			setTimeout(() => {
				const chatWindow = document.querySelector("#chatWindow");
				chatWindow.scrollTop = chatWindow.scrollHeight;
			}, 0);
		}

		function onNewMessage(message) {
			setMessages(prevMessages => [ ...prevMessages, message ]);
			handleScroll();
		}

		function onMessages(messages) {
			setMessages(messages);
			handleScroll();
		}

		function onUserAdded(message) {
			setMessages(prevMessages => [ ...prevMessages, message ]);
			handleScroll();
		}

		function onUserRemoved(message) {
			setMessages(prevMessages => [ ...prevMessages, message ]);
			handleScroll();
		}

		socket.on("newMessage", onNewMessage);
		socket.on("messages", onMessages);
		socket.on("userAdded", onUserAdded);
		socket.on("userRemoved", onUserRemoved);

		return () => socket
			.off("newMessage", onNewMessage)
			.off("messages", onMessages)
			.off("userAdded", onUserAdded)
			.off("userRemoved", onUserRemoved);
	}, [ userScrolled ]);

	function onScroll(e) {
		const chatWindow = e.target;
		const scrollBottom = chatWindow.scrollHeight - chatWindow.clientHeight - chatWindow.scrollTop;
		setUserScrolled(scrollBottom > 1);
	}

	function onClick(e) {
		const chatWindow = document.querySelector("#chatWindow");
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}

	return (
		<div
			id="chatWindow"
			onScroll={onScroll}
		>
			<div>
				{messages.map(({ timestamp, isSystem, user, message }, index) => (
					<MessageEntry
						key={timestamp}
						timestamp={new Date(timestamp).toLocaleTimeString()}
						isSystem={isSystem}
						user={user}
						message={message}
					/>
				))}
			</div>
		</div>
	);
}

export default ChatWindow;
