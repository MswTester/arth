import { Request } from 'express';
import os from 'os';

export const isHost = (req: Request) => {
    return req.hostname === 'localhost'
    || req.hostname === '127.0.0.1'
    || req.hostname === '::1'
    || Object.values(os.networkInterfaces()).flat().some((iface) => iface.address === req.hostname);
}