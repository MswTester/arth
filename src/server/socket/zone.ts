import { Server, Socket } from "socket.io";

const zone = (socket: Socket, io: Server) => {
    socket.on('disconnect', (data) => {});
}

export default zone