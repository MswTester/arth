import { Server } from "socket.io";
import Logger from "../lib/pretty-logger";

const log = (id: string, ...args: any[]) => Logger.header(`(${id})`, 'black', ...args);

const handle = (io: Server) => {
    io.on('connection', (socket) => {
        log(socket.id, 'Client connected');
      
        socket.on('disconnect', (data) => {
            log(socket.id, 'Client disconnected');
        });
    });
}

export default handle