import { Express } from 'express';
import { Server } from 'socket.io';
import CloudSystem from '../services/cloud';
import { join } from 'path';
import { publicCors } from '../services/cors';

const cloud = (app: Express, cloudDir:string, io: Server) => {
    app.get('/api/cloud/list', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        try{
            const files = await CloudSystem.list(join(cloudDir, path))
            res.status(200).json(files);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/find', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        const name = req.query.name?.toString() || '';
        const type = req.query.type?.toString() as any || 'file';
        try{
            const data = await CloudSystem.find(join(cloudDir, path), name, type)
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/findContent', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        const content = req.query.content?.toString() || '';
        try{
            const data = await CloudSystem.findContent(join(cloudDir, path), content)
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/read', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        try{
            const data = await CloudSystem.read(join(cloudDir, path))
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/readMany', publicCors, async (req, res) => {
        const paths:string[] = req.body.paths || [];
        try{
            const data = await CloudSystem.readMany(paths.map((path: string) => join(cloudDir, path)))
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/write', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        const data = req.body.data || '';
        try{
            await CloudSystem.write(join(cloudDir, path), data)
            res.status(200).json({message: 'File written successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/writeMany', publicCors, async (req, res) => {
        const paths:string[] = req.body.paths || [];
        const data:string[] = req.body.data || [];
        try{
            await CloudSystem.writeMany(paths.map((path: string) => join(cloudDir, path)), data)
            res.status(200).json({message: 'Files written successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/delete', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        try{
            await CloudSystem.delete(join(cloudDir, path))
            res.status(200).json({message: 'File deleted successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/deleteMany', publicCors, async (req, res) => {
        const paths:string[] = req.body.paths || [];
        try{
            await CloudSystem.deleteMany(paths.map((path: string) => join(cloudDir, path)))
            res.status(200).json({message: 'Files deleted successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/createDir', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        try{
            await CloudSystem.createDir(join(cloudDir, path))
            io.to("cloud-" + join(path, "..")).emit("cloud-createDir", path)
            res.status(200).json({message: 'Directory created successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/createFile', publicCors, async (req, res) => {
        const path = req.query.path?.toString() || '';
        try{
            await CloudSystem.createFile(join(cloudDir, path))
            io.to("cloud-" + join(path, "..")).emit("cloud-createFile", path)
            res.status(200).json({message: 'File created successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/move', publicCors, async (req, res) => {
        const oldDir = req.query.oldDir?.toString() || '';
        const newDirTo = req.query.newDirTo?.toString() || '';
        try{
            await CloudSystem.move(join(cloudDir, oldDir), join(cloudDir, newDirTo))
            res.status(200).json({message: 'File moved successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/moveMany', publicCors, async (req, res) => {
        const oldDirs:string[] = req.body.oldDirs || [];
        const newDirTo = req.query.newDirTo?.toString() || '';
        try{
            await CloudSystem.moveMany(oldDirs.map((oldDir: string) => join(cloudDir, oldDir)), join(cloudDir, newDirTo))
            res.status(200).json({message: 'Files moved successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/copy', publicCors, async (req, res) => {
        const oldDir = req.query.oldDir?.toString() || '';
        const newDirTo = req.query.newDirTo?.toString() || '';
        try{
            await CloudSystem.copy(join(cloudDir, oldDir), join(cloudDir, newDirTo))
            io.to("cloud-" + newDirTo).emit("cloud-copy", oldDir);
            res.status(200).json({message: 'File copied successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.post('/api/cloud/copyMany', publicCors, async (req, res) => {
        const oldDirs:string[] = req.body.oldDirs || [];
        const newDirTo = req.query.newDirTo?.toString() || '';
        try{
            await CloudSystem.copyMany(oldDirs.map((oldDir: string) => join(cloudDir, oldDir)), join(cloudDir, newDirTo))
            io.to("cloud-" + newDirTo).emit("cloud-copyMany", oldDirs);
            res.status(200).json({message: 'Files copied successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/rename', publicCors, async (req, res) => {
        const dir = req.query.dir?.toString() || '';
        const name = req.query.name?.toString() || '';
        try{
            await CloudSystem.rename(join(cloudDir, dir), name)
            io.to("cloud-" + join(dir, "..")).emit("cloud-rename", name);
            res.status(200).json({message: 'File renamed successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })

    app.get('/api/cloud/renameMany', publicCors, async (req, res) => {
        const dirs:string[] = req.body.dirs || [];
        const name = req.query.name?.toString() || '';
        try{
            await CloudSystem.renameMany(dirs.map((dir: string) => join(cloudDir, dir)), name)
            res.status(200).json({message: 'Files renamed successfully'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    })
}

export default cloud;
