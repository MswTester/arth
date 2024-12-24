import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import handle from './socket';
import Logger from '../lib/pretty-logger';
import os from 'os';
import cloud from './controllers/cloud';
import db from './controllers/db';
import sys from './controllers/sys';
import Config from '../lib/config-reader';
import { existsSync, mkdirSync } from 'fs';
import { publicCors } from './services/cors';
import sysInterval from './sockets/sys';

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

// Define the constants
const PIN = '0000';
const PORT = 3000;
const INTERVAL = 500;
const EXPRESS_LIMIT = '8mb';

// Define the paths to the root and client directories
export const root = path.join(__dirname, '/../..');
const client = path.join(root, '/dist/client');
const publicPath = path.join(root, '/public');

// Directory setup
const dir = path.join(root, 'dir');
const config:Record<string, any> = Config.read(path.join(dir, '.config'))
const dir_root = path.join(dir, config.root || '/');
const dir_cloud = path.join(dir, config.cloud || '/cloud');
const dir_db = path.join(dir, config.db || '/db');

// Check directories
if(!existsSync(dir_root)){
    Logger.warn("Root directory not found. Creating one...");
    mkdirSync(dir_root);
}
if(!existsSync(dir_cloud)){
    Logger.warn("Cloud directory not found. Creating one...");
    mkdirSync(dir_cloud);
}
if(!existsSync(dir_db)){
    Logger.warn("Database directory not found. Creating one...");
    mkdirSync(dir_db);
}

// Define the middleware
app.use(express.json({limit: EXPRESS_LIMIT}));

// Define the API routes;
cloud(app, dir_cloud, io);
db(app, dir_db);
sys(app);

// Serve static files from the client directory
app.use(express.static(publicPath));
app.use(express.static(client));
app.get('*', publicCors, (req, res) => {
    res.sendFile(path.join(publicPath, '/index.html'));
});

// Handle interval updates
const loop = setInterval(() => {
    sysInterval(io);
}, INTERVAL);

// Handle socket connections
handle(io, PIN);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
    const version = process.env.npm_package_version;
    const startText = `========== ARTH v${version} ==========`;
    console.log(`${Logger.color.bright}${Logger.color.fg.green}${startText}`, Logger.color.reset);
    Logger.info(`Server listening on port *:${PORT}`);
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname]?.forEach((iface) => {
            if (iface.family !== 'IPv4' || iface.internal !== false) return;
            Logger.info(ifname, "|", iface.address);
        });
    });
    Logger.info("Platform:", os.platform());
    Logger.info("Arch:", os.arch());
    Logger.info("CPUs:", os.cpus().length);
    Logger.info("OS type:", os.type());
    Logger.info("Hostname:",os.hostname());
    Logger.info("Node version:", process.version);
    const isAndroid = os.platform() === 'android' && os.arch().startsWith('arm');
    if(!isAndroid) Logger.warn("Host must be in android environment to use all features.");
});

// Handle server termination
process.on('SIGINT', () => {
    clearInterval(loop);
    server.close(() => {
        Logger.warn("Server terminated.");
        process.exit(0);
    });
});