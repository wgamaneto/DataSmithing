import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Product } from '../interfaces/productinterface';

export default class ProductModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getAll(): Promise<Product[]> {
    const [result] = await this.connection.execute<RowDataPacket[] & Product[]>(
      'SELECT * FROM Trybesmith.products',
    );
    return result;
  }

  public async create(product: Product): Promise<Product> {
    const { name, amount } = product;
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.products (name, amount) VALUES (?,?)',
      [name, amount],
    );
    return { id: insertId, ...product };
  }

  public async updateOrderId(productId: number, orderId: number): Promise<void> {
    await this.connection.execute<ResultSetHeader>(
      'UPDATE Trybesmith.products SET order_id = ? WHERE id = ?',
      [orderId, productId],
    );
  }
}