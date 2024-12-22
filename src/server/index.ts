import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import api from './api';
import handle from './socket';
import Logger from '../lib/pretty-logger';
import os from 'os';

// Create an Express app and an HTTP server
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        allowedHeaders: '*',
        methods: ['GET', 'POST'],
    },
});

// Define the port to listen on
const PORT = 3000;

// Define the paths to the root and client directories
const root = path.join(__dirname, '../..');
const client = path.join(root, 'dist/client');

// Serve static files from the client directory
app.use(express.static(client));
app.get('*', (req, res) => {
    res.sendFile(path.join(root, 'public/index.html'));
});

// Define the API routes
api(app);

// Handle socket connections
handle(io);

// Start the server
server.listen(PORT, () => {
    Logger.bracket('ARTH', 'blue', `Server listening on port *:${PORT}`);
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname]?.forEach((iface) => {
            if (iface.family !== 'IPv4' || iface.internal !== false) return;
            Logger.bracket(ifname, 'cyan', iface.address);
        });
    });
    Logger.info("Platform:", os.platform());
    Logger.info("Arch:", os.arch());
    Logger.info("CPUs:", os.cpus().length);
    Logger.info("OS type:", os.type());
    Logger.info("Hostname:", os.hostname());
    Logger.info("Node version:", process.version);
});