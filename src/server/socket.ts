import { Server } from "socket.io";
import Logger from "../lib/pretty-logger";
import zone from "./socket/zone";
import sys from "./socket/sys";

const log = (id: string, ...args: any[]) => Logger.header(`(${id})`, 'yellow', ...args);

const handle = (io: Server) => {
    io.on('connection', (socket) => {
        log(socket.id, 'Client connected');

        // Handle socket events
        sys(socket, io);
        zone(socket, io);

        socket.on('disconnect', (data) => {
            log(socket.id, 'Client disconnected');
        });
    });
}

export default handle;