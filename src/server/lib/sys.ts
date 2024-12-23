import { exec, execSync } from "child_process";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { promisify } from "util";
import Logger from "../../lib/pretty-logger";

const execAsync = promisify(exec);

export const getCPU = async () => {
    if(!existsSync('/proc/stat')) return { error: 'Host must be in android environment.' };
    const file = await readFile('/proc/stat', { encoding: 'utf-8' })
    const lines = file.split('\n');
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
    return {
        cores,
        usage: 100 * cores.reduce((acc, core) => acc + core.usage, 0) / cores.length,
    };
}

export const getMemory = async () => {
    if(!existsSync('/proc/meminfo')) return { error: 'Host must be in android environment.' };
    const file = await readFile('/proc/meminfo', { encoding : 'utf8' });
    const lines = file.split('\n');
    const memoryInfo: any = {};
    lines.forEach(line => {
        if (line.includes(':')) {
            const [key, value] = line.trim().split(':').map(s => s.trim());
            memoryInfo[key] = parseInt(value.split(' ')[0], 10);
        }
    });
    const MemUsage = memoryInfo.MemTotal - memoryInfo.MemFree - memoryInfo.Buffers - memoryInfo.Cached;
    return {
        ...memoryInfo,
        MemUsage,
        usage: 100 * MemUsage / memoryInfo.MemTotal,
    }
}

export const getBattery = async () => {
    if(!existsSync('/sys/class/power_supply/battery/uevent')) return { error: 'Host must be in android environment.' };
    const { stdout, stderr } = await execAsync('dumpsys battery');
    if (stderr) return {error: stderr };
    const batteryInfo: Record<string, string> = {};
    const lines = stdout.split('\n');
    lines.forEach(line => {
        if (line.includes(':')) {
            const [key, value] = line.trim().split(':').map(s => s.trim());
            batteryInfo[key] = value;
        }
    });
    return batteryInfo;
}

export const getStorage = async () => {
    if(!existsSync('/') || !existsSync('/data')) return { error: 'Host must be in android environment.' };
    const {stdout, stderr } = await execAsync('df / /data');
    if (stderr) return { error: stderr };
    const lines = stdout.split('\n');
    lines.shift();
    const storageInfo: Record<string, any> = {};
    lines.filter(line => line.trim()).forEach((line, i:number) => {
        const [filesystem, _size, _used, _available, _capacity, mounted] = line.trim().split(/\s+/);
        const name = i === 0 ? 'root' : 'storage';
        const size = parseInt(_size, 10);
        const used = parseInt(_used, 10);
        const available = parseInt(_available, 10);
        const capacity = parseInt(_capacity.replace("%", ""), 10);
        storageInfo[name] = { filesystem, size, used, available, capacity, mounted };
    });
    return storageInfo;
}
