import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');
function SocketConnector(cb: (arg0: null, arg1: any) => void) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}
export { SocketConnector };
