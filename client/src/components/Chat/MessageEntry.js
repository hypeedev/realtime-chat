import React from "react";
import Linkify from "react-linkify";

function MessageEntry({ timestamp, isSystem, user: { id, nickname }, message }) {
	const linkifyDecorator = (href, text, key) => (
		<a href={href} key={key} target="_blank" rel="noopener noreferrer">
			{text}
		</a>
	);

	if (isSystem) {
		return (
			<div className="messageEntry systemMessage">
				{message}
			</div>
		);
	} else {
		return (
			<div className="messageEntry">
				<header>
					<span className="nickname">{nickname}</span>
					<span className="timestamp">{timestamp}</span>
				</header>
				<span className="message">
					<Linkify componentDecorator={linkifyDecorator}>{message}</Linkify>
				</span>
			</div>
		);
	}
}

export default MessageEntry;
