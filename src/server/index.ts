import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import handle from './socket';
import Logger from '../lib/pretty-logger';
import os from 'os';
import cloud from './api/cloud';
import db from './api/db';
import Config from '../lib/config-reader';
import { existsSync, mkdirSync } from 'fs';
import sys from './api/sys';
import { publicCors } from './lib/cors';

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

// Define the API routes;
cloud(app, dir_cloud);
db(app, dir_db);
sys(app);

// Serve static files from the client directory
app.use(publicCors);
app.use(express.static(publicPath));
app.use(express.static(client));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, '/index.html'));
});

// Handle socket connections
handle(io);

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
            Logger.bracket(ifname, 'cyan', iface.address);
        });
    });
    Logger.info("Platform:", os.platform());
    Logger.info("Arch:", os.arch());
    Logger.info("CPUs:", os.cpus().length);
    Logger.info("OS type:", os.type());
    Logger.info("Hostname:", os.hostname());
    Logger.info("Node version:", process.version);
    const isAndroid = os.platform() === 'android' && os.arch().startsWith('arm');
    if(!isAndroid) Logger.warn("Host must be in android environment to use all features.");
});
