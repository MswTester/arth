import { Express } from 'express';
import { getBattery, getCPU, getMemory } from '../lib/sys';

const sys = (app: Express) => {
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
}

export default sys;