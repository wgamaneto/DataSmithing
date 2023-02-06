import { Request, Response } from 'express';
import OrderService from '../services/orderService';

export default class OrderController {
  constructor(private orderService = new OrderService()) { }

  public getAll = async (_req: Request, res: Response): Promise<Response> => {
    const result = await this.orderService.getAll();
    return res.status(200).json(result);
  };

  public insert = async (req: Request, res: Response): Promise<Response> => {
    const { authorization: token } = req.headers;
    const { productsIds } = req.body;

    if (!token) return res.status(401).json({ message: 'Token not found' });

    const { type, message } = await this.orderService.insert(token, productsIds);

    if (type !== 201) return res.status(type).json({ message });
    return res.status(type).json(message);
  };
}