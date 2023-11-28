import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

import MessageEntry from "./MessageEntry";
import MessageContextMenu from "./MessageContextMenu";

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

		function onMessageDeleted(message) {
			const index = messages.findIndex(m => m.timestamp === message.timestamp);
			if (index !== -1) {
				const msgs = [ ...messages ];
				msgs.splice(index, 1);
				setMessages(msgs);
			}
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
		socket.on("messageDeleted", onMessageDeleted);
		socket.on("messages", onMessages);
		socket.on("userAdded", onUserAdded);
		socket.on("userRemoved", onUserRemoved);

		return () => socket
			.off("newMessage", onNewMessage)
			.off("messageDeleted", onMessageDeleted)
			.off("messages", onMessages)
			.off("userAdded", onUserAdded)
			.off("userRemoved", onUserRemoved);
	}, [ userScrolled, messages ]);

	function onScroll(e) {
		const chatWindow = e.target;
		const scrollBottom = chatWindow.scrollHeight - chatWindow.clientHeight - chatWindow.scrollTop;
		setUserScrolled(scrollBottom > 1);
	}

	let repeatedMessageCount = 0;

	return (
		<div
			id="chatWindow"
			onScroll={onScroll}
		>
			<div>
				<MessageContextMenu />
				{messages.map(({ timestamp, isSystem, user, message, image }, index) => {
					if (messages[index - 1]?.user?.token === user?.token && repeatedMessageCount < 5) {
						repeatedMessageCount++;
						return (
							<MessageEntry
								key={timestamp}
								isSystem={isSystem}
								message={message}
								image={image}
							/>
						);
					} else {
						repeatedMessageCount = 0;
						return (
							<MessageEntry
								key={timestamp}
								timestamp={timestamp}
								isSystem={isSystem}
								user={user}
								message={message}
								image={image}
							/>
						);
					}
				})}
			</div>
		</div>
	);
}

export default ChatWindow;
