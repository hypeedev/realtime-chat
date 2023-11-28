import socket from "../../socket.js";
import React, { useState } from "react";
import "./Chat.css";

function MessageInput() {
	const [ message, setMessage ] = useState("");
	const [ image, setImage ] = useState(null);

	function onChange(e) {
		e.preventDefault();
		setMessage(e.target.value);
	}

	function onKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			const msg = message.trimEnd();
			if (msg === "" && image === null) return;
			socket.emit("sendMessage", { message: msg, image });
			setMessage("");
			setImage(null);
		} else if (e.key === "Tab") {
			e.preventDefault();
			setMessage(message + "\t");
		}
	}

	function onPaste(e) {
		for (const item of e.clipboardData.items) {
			if (item.kind === "file") {
				e.preventDefault();

				const blob = item.getAsFile();
				const reader = new FileReader();

				reader.addEventListener("load", event => {
					setImage(event.target.result);
					setTimeout(() => {
						const chatWindow = document.querySelector("#chatWindow");
						chatWindow.scrollTop = chatWindow.scrollHeight;
					}, 0);
				});

				reader.readAsDataURL(blob);
			}
		}
	}

	return (
		<div id="messageInput">
			{image ? (
				<img
					src={image}
					alt="image"
					className="imageAttachment"
				/>
			) : null}
			<textarea
				id="messageInputTextArea"
				className="input"
				value={message}
				placeholder="Enter your message"
				onChange={onChange}
				onKeyDown={onKeyDown}
				onPaste={onPaste}
			/>
		</div>
	);
}

export default MessageInput;
