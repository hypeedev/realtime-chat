import io from "socket.io-client";

const socket = io("http://192.168.1.207:3001", {
	transports: [ "websocket" ]
});

export default socket;
