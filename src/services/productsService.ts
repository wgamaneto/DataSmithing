import ProductsModel from '../models/productsModel';
import connection from '../models/connection';
import { Product } from '../interfaces/productinterface';
import { Validation } from '../interfaces/validationsInterface';

export default class ProductService {
  public model: ProductsModel;

  constructor() {
    this.model = new ProductsModel(connection);
  }

  private static verifyProductName(product: Product): Validation | null {
    const { name } = product;

    if (!name || name == null) return { type: 400, message: '"name" is required' };
    if (typeof name !== 'string') return { type: 422, message: '"name" must be a string' };
    if (name.length <= 2) {
      return { type: 422, message: '"name" length must be at least 3 characters long' };
    }
    return null;
  }

  private static verifyProductAmount(product: Product): Validation | null {
    const { amount } = product;

    if (!amount) return { type: 400, message: '"amount" is required' };
    if (typeof amount !== 'string') return { type: 422, message: '"amount" must be a string' };
    if (amount.length <= 2) {
      return { type: 422, message: '"amount" length must be at least 3 characters long' };
    }
    return null;
  }

  public async getAll(): Promise<Product[]> {
    const products = await this.model.getAll();
    return products;
  }

  public async create(product: Product): Promise<{ type: number, message: (string | Product) }> {
    const isNameValid = ProductService.verifyProductName(product);
    const isAmountValid = ProductService.verifyProductAmount(product);

    if (isNameValid !== null) return isNameValid;
    if (isAmountValid !== null) return isAmountValid;

    const newProduct = await this.model.create(product);
    return { type: 201, message: newProduct };
  }
}