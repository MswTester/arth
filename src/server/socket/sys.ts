import { Server, Socket } from "socket.io";

const sys = (socket: Socket, io: Server) => {
    socket.on('disconnect', (data) => {});
}

export default sys;