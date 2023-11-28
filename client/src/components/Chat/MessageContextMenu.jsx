import React from "react";

function MessageContextMenu() {
	return (
		<div id="messageContextMenu">
			<div id="messageContextMenuDelete">
				<span className="actionName">Delete</span>
				<i className="fa-solid fa-trash" />
			</div>
			<div id="messageContextMenuCopy">
				<span className="actionName">Copy</span>
				<i className="fa-solid fa-copy" />
			</div>
		</div>
	);
}

export default MessageContextMenu;
