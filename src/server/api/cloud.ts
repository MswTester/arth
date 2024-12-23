import { Express } from 'express';
import { Server } from 'socket.io';

const cloud = (app: Express, cloudDir:string, io: Server) => {
    app.get('/api/cloud/list', (req, res) => {
        
    })
}

export default cloud;