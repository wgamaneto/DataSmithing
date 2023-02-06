import { Router } from 'express';
import OrderController from '../controllers/ordersController';

const route = Router();

const orderController = new OrderController();

route.get('/', orderController.getAll);
route.post('/', orderController.insert);

export default route;