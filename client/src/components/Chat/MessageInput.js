import socket from "../../socket.js";
import React, { useState } from "react";
import "./Chat.css";

function MessageInput() {
	const [ message, setMessage ] = useState("");

	function onChange(e) {
		e.preventDefault();
		setMessage(e.target.value);
	}

	function onKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			const msg = message.trimEnd();
			if (msg === "") return;
			socket.emit("sendMessage", msg);
			setMessage("");
		} else if (e.key === "Tab") {
			e.preventDefault();
			setMessage(message + "\t");
		}
	}

	return (
		<textarea
			id="messageInput"
			className="input"
			value={message}
			placeholder="Enter your message"
			onChange={onChange}
			onKeyDown={onKeyDown}
		/>
	);
}

export default MessageInput;
