import { Server } from "socket.io";
import Logger from "../lib/pretty-logger";
import zone from "./socket/zone";

const log = (id: string, ...args: any[]) => Logger.header(`(${id})`, 'yellow', ...args);

const handle = (io: Server, pin: string) => {
    io.on('connection', (socket) => {
        log(socket.id, 'Client connected');

        // Handle socket events
        zone(socket, io);

        // Default socket events

        socket.on('join', (data: string) => {
            socket.join(data);
        });

        socket.on('leave', (data: string) => {
            socket.leave(data);
        });

        socket.on('message', (data: MessageData) => {
            socket.to(data.room).emit(data.channel, data.data);
        });

        socket.on('ping', () => {
            socket.emit('pong');
        })

        socket.on('log', (...args: any[]) => {
            log(socket.id, ...args);
        });

        socket.on('unlock', (_pin: string) => {
            socket.emit('unlock', _pin === pin);
        })

        socket.on('disconnect', (data) => {
            log(socket.id, 'Client disconnected');
        });
    });
}

export default handle;