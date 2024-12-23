import cors from 'cors';

export const privateCors = cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost', 'http://127.0.0.1', 'https://example.com'];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
});
export const publicCors = cors({origin: '*'});