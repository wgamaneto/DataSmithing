import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Order } from '../interfaces/orderInterface';
import ProductModel from './productsModel';

export default class OrderModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<Order[]> {
    const [result] = await this.connection.execute<RowDataPacket[] & Order[]>(
      `SELECT orders.id, orders.user_id as userId, JSON_ARRAYAGG(products.id) as productsIds
      FROM Trybesmith.orders AS orders
      INNER JOIN Trybesmith.products AS products
      ON orders.id = products.order_id
      GROUP BY orders.id;`,
    );
    return result;
  }

  public async createOrder(userId: number): Promise<number> {
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.orders (user_id) VALUE (?);', 
      [userId],
    );
    return insertId;
  }

  public async insert(userId: number, productIds: number[]): Promise<void> {
    const orderId = await this.createOrder(userId);

    const productModel = new ProductModel(this.connection);
    const updateProducts = productIds
      .map((id) => productModel.updateOrderId(id, orderId));
    await Promise.all(updateProducts);
  }
}