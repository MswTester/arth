// Pretty logger class

import { appendFileSync, writeFileSync } from "fs";

type Color = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "crimson";

class Logger {
    static readonly color:Record<string, any> = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        underscore: '\x1b[4m',
        blink: '\x1b[5m',
        reverse: '\x1b[7m',
        hidden: '\x1b[8m',
        fg: {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            crimson: '\x1b[38m',
        },
        bg: {
            black: '\x1b[40m',
            red: '\x1b[41m',
            green: '\x1b[42m',
            yellow: '\x1b[43m',
            blue: '\x1b[44m',
            magenta: '\x1b[45m',
            cyan: '\x1b[46m',
            white: '\x1b[47m',
            crimson: '\x1b[48m',
        },
    };

    static clear() {
        console.clear();
    }

    static info(...args: any[]) {
        const header = `${Logger.color.fg.blue}[INFO]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static sysInfo(dir: string, ...args: any[]) {
        const header = `${Logger.color.fg.magenta}[INFO]${Logger.color.reset}`;
        const timeline = new Date().toISOString();
        appendFileSync(dir, `\n[${timeline}] ${header} ${args.join(' ')}`);
    }

    static warn(...args: any[]) {
        const header = `${Logger.color.fg.yellow}[WARN]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static sysWarn(dir: string, ...args: any[]) {
        const header = `${Logger.color.fg.yellow}[WARN]${Logger.color.reset}`;
        const timeline = new Date().toISOString();
        appendFileSync(dir, `\n[${timeline}] ${header} ${args.join(' ')}`);
    }

    static error(...args: any[]) {
        const header = `${Logger.color.fg.red}[ERROR]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static sysError(dir: string, ...args: any[]) {
        const header = `${Logger.color.fg.red}[ERROR]${Logger.color.reset}`;
        const timeline = new Date().toISOString();
        appendFileSync(dir, `\n[${timeline}] ${header} ${args.join(' ')}`);
    }

    static success(...args: any[]) {
        const header = `${Logger.color.fg.green}[SUCCESS]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static sysSuccess(dir: string, ...args: any[]) {
        const header = `${Logger.color.fg.green}[SUCCESS]${Logger.color.reset}`;
        const timeline = new Date().toISOString();
        appendFileSync(dir, `\n[${timeline}] ${header} ${args.join(' ')}`);
    }

    static log(...args: any[]) {
        const header = `${Logger.color.fg.cyan}[LOG]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static sysLog(dir: string, ...args: any[]) {
        const header = `${Logger.color.fg.cyan}[LOG]${Logger.color.reset}`;
        const timeline = new Date().toISOString();
        appendFileSync(dir, `\n[${timeline}] ${header} ${args.join(' ')}`);
    }

    static bracket(_header: string, color: Color, ...args: any[]) {
        const header = `${Logger.color.fg[color.toLowerCase()]}[${_header}]${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static header(_header: string, color: Color, ...args: any[]) {
        const header = `${Logger.color.fg[color.toLowerCase()]}${_header}${Logger.color.reset}`;
        console.log(header, ...args);
    }

    static colored(color: Color, ...args: any[]) {
        const header = `${Logger.color.fg[color.toLowerCase()]}`;
        console.log(header, ...args, Logger.color.reset);
    }
}

export default Logger;