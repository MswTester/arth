import { Server } from "socket.io";
import Logger from "../lib/pretty-logger";
import zone from "./socket/zone";
import sys from "./socket/sys";

const log = (id: string, ...args: any[]) => Logger.header(`(${id})`, 'black', ...args);

const handle = (io: Server) => {
    io.on('connection', (socket) => {
        log(socket.id, 'Client connected');
      
        socket.on('disconnect', (data) => {
            log(socket.id, 'Client disconnected');
        });
    });
    sys(io);
    zone(io);
}

export default handle;