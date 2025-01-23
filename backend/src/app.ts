import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';

const app = express();

//middlewares
app.use(express.json({
    limit: '500kb'
}));


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieparser());
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

// routes
app.use('/api/v1/auth', authRoutes);



// error handler
app.use(errorMiddleware);

export default app;