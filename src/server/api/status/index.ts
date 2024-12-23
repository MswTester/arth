import { Express } from 'express';
import { exec } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const status = (app: Express) => {
    // Get CPU usage
    app.get('/status/cpu', (req, res) => {
        if(existsSync('/proc/stat') === false) res.status(500).json({ error: 'Host must be in android environment.' });
        const lines = readFileSync('/proc/stat', 'utf8').split('\n');
        let cores = [];
        lines.forEach(line => {
            if (line.startsWith('cpu')) {
                const [cpu, ...times] = line.split(/\s+/);
                const idle = parseInt(times[3], 10);
                const ioWait = parseInt(times[4], 10);
                const total = times.reduce((acc, t) => acc + parseInt(t, 10), 0);
                const usage = (total - idle - ioWait) / total;
                cores.push({
                    cpu,
                    usage,
                    total,
                });
            }
        });
        res.status(200).json({
            cores,
            usage: 100 * cores.reduce((acc, core) => acc + core.usage, 0) / cores.length,
        });
    });

    // Get memory usage
    app.get('/status/memory', (req, res) => {
        if(existsSync('/proc/meminfo') === false) res.status(500).json({ error: 'Host must be in android environment.' });
        const lines = readFileSync('/proc/meminfo', 'utf8').split('\n');
        const memoryInfo: any = {};
        lines.forEach(line => {
            if (line.includes(':')) {
                const [key, value] = line.trim().split(':').map(s => s.trim());
                memoryInfo[key] = parseInt(value.split(' ')[0], 10);
            }
        });
        const MemUsage = memoryInfo.MemTotal - memoryInfo.MemFree - memoryInfo.Buffers - memoryInfo.Cached;
        res.status(200).json({
            ...memoryInfo,
            MemUsage,
            usage: 100 * MemUsage / memoryInfo.MemTotal,
        });
    });

    // Get battery status
    app.get('/status/battery', (req, res) => {
        if(existsSync('/sys/class/power_supply/battery/uevent') === false) res.status(500).json({ error: 'Host must be in android environment.' });
        exec('dumpsys battery', (err, stdout, stderr) => {
            if (err) {
                res.status(500).json({error: err.message});
                return;
            }
            const batteryInfo: any = {};
            const lines = stdout.split('\n');
            lines.forEach(line => {
                if (line.includes(':')) {
                    const [key, value] = line.trim().split(':').map(s => s.trim());
                    batteryInfo[key] = value;
                }
            });
            res.status(200).json(batteryInfo);
        });
    });
}

export default status;