import { Router } from 'express';
import UserController from '../controllers/usersCOntroller';

const route = Router();

const userController = new UserController();

route.post('/', userController.create);

export default route;