import { Server } from "socket.io";

const sys = (io: Server) => {
    io.on('connection', (socket) => {
      
        socket.on('disconnect', (data) => {
        });
    });
}

export default sys