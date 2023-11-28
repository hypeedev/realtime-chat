import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

function LoginWindow() {
	const user = JSON.parse(window.localStorage.getItem("user"));

	const [ nickname, setNickname ] = useState(user.nickname);

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

			if (user.nickname !== nickname) {
				user.nickname = nickname;
				localStorage.setItem("user", JSON.stringify(user));
			}

			socket.emit("login", user, user => {
				if (!user) {
					alert("Nickname is already taken.");
					return;
				}

				document.querySelector("#loginWindow").style.display = "none";
				document.querySelector("#messageInputTextArea")?.focus();
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
				value={nickname}
				required
				onChange={onChange}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
}

export default LoginWindow;
