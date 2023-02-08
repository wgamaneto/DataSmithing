import { Login } from '../interfaces/loginInterface';
import { Validation } from '../interfaces/validationsInterfaces';
import connection from '../models/connection';
import LoginModel from '../models/loginModel';
import Token from '../utils/token';

export default class LoginService {
  public model: LoginModel;

  constructor() {
    this.model = new LoginModel(connection);
  }

  private static validateKeys(login: Login): Validation | null {
    const { username, password } = login;

    if (!username) {
      return { type: 400, message: '"username" is required' };
    }
    if (!password) {
      return { type: 400, message: '"password" is required' };
    }
    return null;
  }

  public async getUser(login: Login): Promise<{ type: number, message: string }> {
    const isLoginValid = LoginService.validateKeys(login);

    if (isLoginValid !== null) {
      return isLoginValid;
    }

    const result = await this.model.getUser(login);
    if (!result) return { type: 401, message: 'Username or password invalid' };

    const userWithoutPassword = { ...result, password: '' };
    const tokenGenerator = new Token();
    const token = await tokenGenerator.getToken(userWithoutPassword);

    return { type: 200, message: token };
  }
}