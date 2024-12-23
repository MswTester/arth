import { readFileSync } from "fs";

class Config {
    static read(path:string) {
        const content = readFileSync(path, 'utf-8');
        return Object.fromEntries(
            content
            .split('\n')
            .map((line) => line.split('=').map((part) => part.trim()))
        );
    }
}

export default Config;