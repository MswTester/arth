import { Express } from 'express';
import { getBattery, getCPU, getMemory, getStorage } from '../services/sys';
import os from 'os';
import { publicCors } from '../services/cors';

const sys = (app: Express) => {
    // Get system info
    app.get('/api/sys/os', publicCors, async (req, res) => {
        try{
            res.status(200).json({
                hostname: os.hostname(),
                type: os.type(),
                platform: os.platform(),
                arch: os.arch(),
                release: os.release(),
                uptime: os.uptime(),
                loadavg: os.loadavg(),
                totalmem: os.totalmem(),
                freemem: os.freemem(),
                cpus: os.cpus(),
                network: os.networkInterfaces(),
                userInfo: os.userInfo(),
                homedir: os.homedir(),
                tmpdir: os.tmpdir(),
                endianness: os.endianness(),
            });
        } catch(e){
            res.status(500).json({ error: e.message });
        }
    });

    // Get CPU usage
    app.get('/api/sys/cpu', publicCors, async (req, res) => {
        const result = await getCPU();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get memory usage
    app.get('/api/sys/memory', publicCors, async (req, res) => {
        const result = await getMemory();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get battery status
    app.get('/api/sys/battery', publicCors, async (req, res) => {
        const result = await getBattery();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get storage status
    app.get('/api/sys/storage', publicCors, async (req, res) => {
        const result = await getStorage();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });
}

export default sys;