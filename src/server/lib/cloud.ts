import { access, cp, lstat, mkdir, readdir, readFile, rename, rm, writeFile } from "fs/promises";
import { join } from "path";

interface FileInfo {
    name: string;
    size: number;
    isDirectory: boolean;
    created: number;
    modified: number;
}

class CloudSystem {
    static async list(dir: string): Promise<FileInfo[]> {
        const files = await readdir(dir);
        return Promise.all(
            files.map(async (file) => {
                const stat = await lstat(join(dir, file));
                return {
                    name: file,
                    size: stat.size,
                    isDirectory: stat.isDirectory(),
                    created: stat.birthtime.getTime(),
                    modified: stat.mtime.getTime(),
                };
            })
        );
    }

    static async find(
        dir: string,
        name: string,
        type: "file" | "dir" = "file",
        depths:number = 4
    ): Promise<FileInfo[]> {
        if (depths < 0) return [];
        const files = await CloudSystem.list(dir);
        const matched = files.filter(
            (f) => f.name === name && (type === "file" ? !f.isDirectory : f.isDirectory)
        );
        const subdirs = files.filter((f) => f.isDirectory);
        const results = await Promise.all(
            subdirs.map((sd) => CloudSystem.find(join(dir, sd.name), name, type, depths - 1))
        );
        return matched.concat(...results);
    }

    static async findContent(dir: string, content: string, depths:number = 4): Promise<FileInfo[]> {
        if (depths < 0) return [];
        const result: FileInfo[] = [];
        const files = await CloudSystem.list(dir);

        await Promise.all(
            files.map(async (file) => {
                const path = join(dir, file.name);
                if (file.isDirectory) {
                    result.push(...(await CloudSystem.findContent(path, content, depths - 1)));
                } else {
                    const data = await CloudSystem.read(path);
                    if (typeof data === "string" && data.includes(content)) {
                        result.push(file);
                    }
                }
            })
        );
        return result;
    }

    static async exists(dir: string): Promise<boolean> {
        try {
            await access(dir);
            return true;
        } catch {
            return false;
        }
    }

    static async read(dir: string): Promise<string> {
        const content = await readFile(dir, "utf-8");
        try {
            return JSON.parse(content);
        } catch {
            return content;
        }
    }

    static async readMany(dirs: string[]): Promise<string[]> {
        return Promise.all(dirs.map((dir) => CloudSystem.read(dir)));
    }

    static async write(dir: string, data: string): Promise<void> {
        await writeFile(dir, typeof data === "string" ? data : JSON.stringify(data), "utf-8");
    }

    static async writeMany(dirs: string[], data: string[]): Promise<void> {
        await Promise.all(dirs.map((dir, i) => CloudSystem.write(dir, data[i])));
    }

    static async delete(dir: string): Promise<void> {
        await rm(dir, { recursive: true, force: true });
    }

    static async deleteMany(dirs: string[]): Promise<void> {
        await Promise.all(dirs.map((dir) => CloudSystem.delete(dir)));
    }

    static async createDir(dir: string): Promise<void> {
        await mkdir(dir, { recursive: true });
    }

    static async createFile(dir: string): Promise<void> {
        await writeFile(dir, "");
    }

    static async move(oldDir: string, newDirTo: string): Promise<void> {
        await rename(oldDir, join(newDirTo, oldDir.split("/").pop()!));
    }

    static async moveMany(dirs: string[], newDirTo: string): Promise<void> {
        await Promise.all(dirs.map((dir) => CloudSystem.move(dir, newDirTo)));
    }

    static async copy(oldDir: string, newDirTo: string): Promise<void> {
        await cp(oldDir, join(newDirTo, oldDir.split("/").pop()!), { recursive: true });
    }

    static async copyMany(dirs: string[], newDirTo: string): Promise<void> {
        await Promise.all(dirs.map((dir) => CloudSystem.copy(dir, newDirTo)));
    }

    static async rename(dir: string, name: string): Promise<void> {
        await rename(dir, join(dir, "..", name));
    }

    static async renameMany(dirs: string[], name: string): Promise<void> {
        await Promise.all(dirs.map((dir, i) => CloudSystem.rename(dir, `${name}_${i}`)));
    }
}

export default CloudSystem;