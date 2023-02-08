import connection from '../models/connection';
import { Order } from '../interfaces/orderInterface';
import OrderModel from '../models/ordersModel';
import Token from '../utils/token';
import { Validation } from '../interfaces/validationsInterfaces';

export default class OrderService {
  public model: OrderModel;

  constructor() {
    this.model = new OrderModel(connection);
  }

  private static validateKeys(productIds: number[]): (Validation | null) {
    if (!productIds) return { type: 400, message: '"productsIds" is required' };

    if (!Array.isArray(productIds)) return { type: 422, message: '"productsIds" must be an array' };

    if (productIds.length === 0 || Object.values(productIds)
      .some((value) => typeof value !== 'number')) {
      return { type: 422, message: '"productsIds" must include only numbers' };
    }

    return null;
  }

  private static async verifyToken(token: string): Promise<Validation | number> {
    const tokenVerify = new Token();
    const isTokenValid = await tokenVerify.validateToken(token);

    if (isTokenValid === null) return { type: 401, message: 'Invalid token' };

    const { user: { id } } = isTokenValid;
    return id;
  }

  public async getAll(): Promise<Order[]> {
    const orders = await this.model.getAll();
    return orders;
  }

  public async insert(token: string, productsIds: number[]): Promise<{ 
    type: number,
    message: (object | string)
  }> {
    const tokenValidation = await OrderService.verifyToken(token);
    if (typeof tokenValidation === 'object') return tokenValidation;

    const keysValidation = OrderService.validateKeys(productsIds);
    if (keysValidation !== null) return keysValidation;

    await this.model.insert(tokenValidation, productsIds);

    return { type: 201, message: { userId: tokenValidation, productsIds } };
  }
}