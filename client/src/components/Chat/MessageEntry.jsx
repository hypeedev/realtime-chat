import React from "react";
import Linkify from "react-linkify";
import socket from "../../socket";

function MessageEntry(messageEntry) {
	const { timestamp, isSystem, user, message, image } = messageEntry;
	const { token, nickname } = user ?? {};

	const linkifyDecorator = (href, text, key) => (
		<a href={href} key={key} target="_blank" rel="noopener noreferrer">
			{text}
		</a>
	);

	function onDeleteClick(e) {
		socket.emit("deleteMessage", messageEntry);
	}

	function onImageClick(e) {
		e.stopPropagation();

		const imagePreview = document.querySelector("#imagePreview");
		const img = imagePreview.querySelector("img");

		img.src = image;
		imagePreview.style.display = "flex";

		window.addEventListener("click", e => {
			if (e.target !== img) {
				imagePreview.style.display = "none";
			}
		});

		window.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				imagePreview.style.display = "none";
			}
		});
	}

	function onContextMenu(e) {
		e.preventDefault();
		// e.stopPropagation();

		const messageContextMenu = document.querySelector("#messageContextMenu");
		messageContextMenu.style.display = "flex";
		messageContextMenu.style.left = `${e.clientX}px`;
		messageContextMenu.style.top = `${e.clientY}px`;

		const messageContextMenuDelete = messageContextMenu.querySelector("#messageContextMenuDelete");
		messageContextMenuDelete.addEventListener("click", e => {
			socket.emit("deleteMessage", messageEntry);
			messageContextMenu.style.display = "none";
		});

		const messageContextMenuCopy = messageContextMenu.querySelector("#messageContextMenuCopy");
		messageContextMenuCopy.addEventListener("click", e => {
			navigator.clipboard.writeText(message);
			messageContextMenu.style.display = "none";
		});

		window.addEventListener("click", e => {
			e.preventDefault();
			if (e.target !== messageContextMenu) {
				messageContextMenu.style.display = "none";
			}
		});

		window.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				messageContextMenu.style.display = "none";
			}
		});
	}

	if (isSystem) {
		return (
			<div
				className="messageEntry systemMessage"
				onContextMenu={onContextMenu}
			>
				<div className="messageEntryContent">
					{message}
				</div>
			</div>
		);
	} else {
		return (
			<div
				className="messageEntry"
				onContextMenu={onContextMenu}
			>
				<div className="messageEntryContent">
					{user ? (
						<header>
							<span className="nickname">{nickname}</span>
							<span className="timestamp">{new Date(timestamp).toLocaleTimeString()}</span>
						</header>
					) : null}
					<span className="message">
						{image ? (
							<img
								src={image}
								alt="Image"
								className="image"
								onClick={onImageClick}
							/>
						) : null}
						<Linkify componentDecorator={linkifyDecorator}>{message}</Linkify>
					</span>
				</div>
				<div className="messageEntryActions">
					<i
						className="fa-solid fa-trash"
						style={{
							color: "#ff5252",
							display: JSON.parse(localStorage.getItem("user")).token === token ? "block": "none"
						}}
						onClick={onDeleteClick}
					/>
				</div>
			</div>
		);
	}
}

export default MessageEntry;
