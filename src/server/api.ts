import { Express } from 'express';

const api = (app: Express) => {
    app.get('/api', (req, res) => {
        res.json({ message: 'Hello from API!' });
    });
};

export default api;