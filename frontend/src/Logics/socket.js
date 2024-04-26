import { io } from "socket.io-client";

// const URL = "http://localhost:3000";
const URL = "http://192.168.0.103:3000";
const socket = io( URL,
    { autoConnect: false }
);

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
