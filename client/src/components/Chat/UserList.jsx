import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

function UserList() {
	const [ userList, setUserList ] = useState([]);

	useEffect(() => {
		function onGetUsers(users) {
			if (JSON.stringify(users) === JSON.stringify(userList)) return;
			setUserList(users);
		}

		function onUserAdded(user) {
			setUserList(prevUserList => [ ...prevUserList, user ]);
		}

		function onUserRemoved(user) {
			const index = userList.findIndex(u => u.token === user.token);
			if (index !== -1) {
				const users = [ ...userList ];
				users.splice(index, 1);
				setUserList(userList);
			}
		}

		socket.emit("getUsers", onGetUsers);
		socket.on("userAdded", onUserAdded);
		socket.on("userRemoved", onUserRemoved);

		return () => socket
			.off("getUsers", onGetUsers)
			.off("userAdded", onUserAdded)
			.off("userRemoved", onUserRemoved);
	}, [ userList ]);

	return (
		<div id="userList">
			<span>User List</span>
			<hr />
			<ul>
				{userList.map(({ nickname }, index) => (
					<li
						key={index}
						className="user"
					>
						{nickname}
					</li>
				))}
			</ul>
		</div>
	);
}

export default UserList;
