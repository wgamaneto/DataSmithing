import { Request, Response } from 'express';
import ProductService from '../services/productsService';

export default class ProductController {
  constructor(private productService = new ProductService()) {}

  public getAll = async (_req: Request, res: Response): Promise<Response> => {
    const result = await this.productService.getAll();
    return res.status(200).json(result);
  };

  public create = async (req: Request, res: Response): Promise<Response> => {
    const product = req.body;
    const { type, message } = await this.productService.create(product);
    if (type !== 201) return res.status(type).json({ message });
    return res.status(type).json(message);
  };
}