import { Router } from 'express';
import ProductController from '../controllers/productsController';

const route = Router();
const productController = new ProductController();

route.get('/', productController.getAll);
route.post('/', productController.create);

export default route;