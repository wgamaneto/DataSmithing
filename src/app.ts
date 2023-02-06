import express from 'express';
import productsRoute from './routes/productsRoute';
import usersRoute from './routes/userRoute';

const app = express();

app.use(express.json());
app.use('/products', productsRoute);
app.use('/users', usersRoute);

export default app;
