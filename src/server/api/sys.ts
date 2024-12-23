import { Express } from 'express';
import { getBattery, getCPU, getMemory, getStorage } from '../lib/sys';
import os from 'os';

const sys = (app: Express) => {
    // Get system info
    app.get('/api/sys', async (req, res) => {
        try{
            os.cpus();
            res.status(200).json({status:'ok'});
        } catch(e){
            res.status(500).json({ error: e.message });
        }
    });

    // Get CPU usage
    app.get('/api/sys/cpu', async (req, res) => {
        const result = await getCPU();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get memory usage
    app.get('/api/sys/memory', async (req, res) => {
        const result = await getMemory();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get battery status
    app.get('/api/sys/battery', async (req, res) => {
        const result = await getBattery();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });

    // Get storage status
    app.get('/api/sys/storage', async (req, res) => {
        const result = await getStorage();
        if(result.error) res.status(500).json(result);
        res.status(200).json(result);
    });
}

export default sys;