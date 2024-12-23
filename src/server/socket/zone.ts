import { Server } from "socket.io";

const zone = (io: Server) => {
    io.on('connection', (socket) => {
      
        socket.on('disconnect', (data) => {
        });
    });
}

export default zone