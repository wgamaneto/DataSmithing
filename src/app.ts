import express from 'express';
import productsRoute from './routes/productsRoute';
import usersRoute from './routes/userRoute';
import orderRoute from './routes/orderRoute';

const app = express();

app.use(express.json());
app.use('/products', productsRoute);
app.use('/users', usersRoute);
app.use('/orders', orderRoute);

export default app;
