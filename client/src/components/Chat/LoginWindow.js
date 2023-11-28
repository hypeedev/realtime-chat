import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

function LoginWindow() {
	const [ nickname, setNickname ] = useState("");

	useEffect(() => {
		document.querySelector("#nicknameInput").focus();
	});

	function onChange(e) {
		e.preventDefault();
		setNickname(e.target.value);
	}

	function onKeyDown(e) {
		if (e.key === "Enter") {
			e.preventDefault();
			socket.emit("setNickname", nickname, success => {
				if (!success) {
					alert("Nickname is already taken.");
					return;
				}

				document.querySelector("#loginWindow").style.display = "none";
				document.querySelector("#messageInput")?.focus();
			});
		}
	}

	return (
		<div id="loginWindow">
			<input
				type="text"
				id="nicknameInput"
				className="input"
				placeholder="Enter your nickname"
				required
				onChange={onChange}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
}

export default LoginWindow;
