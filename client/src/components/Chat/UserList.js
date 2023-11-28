import socket from "../../socket.js";
import React, { useEffect, useState } from "react";
import "./Chat.css";

function UserList() {
	const [ userList, setUserList ] = useState([]);

	useEffect(() => {
		function onGetUsers(users) {
			setUserList(users);
		}

		function onUserAdded(user) {
			setUserList(prevUserList => [ ...prevUserList, user ]);
		}

		function onUserRemoved(user) {
			const index = userList.findIndex(u => u.id === user.id);
			if (index !== -1) {
				userList.splice(index, 1);
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
			<ul>
				{userList.map(({ nickname }, index) => (
					<li key={index}>
						{nickname}
					</li>
				))}
			</ul>
		</div>
	);
}

export default UserList;
