import UserModel from '../models/userModel';
import connection from '../models/connection';
import { User } from '../interfaces/userInterface';
import Token from '../utils/token';
import { Validation } from '../interfaces/validationsInterface';

export default class UserService {
  public model: UserModel;

  constructor() {
    this.model = new UserModel(connection);
  }

  private static validateUserName(user: User): Validation | null {
    const { username } = user;

    if (!username || username == null) return { type: 400, message: '"username" is required' };
    if (typeof username !== 'string') return { type: 422, message: '"username" must be a string' };
    if (username.length <= 2) {
      return { type: 422, message: '"username" length must be at least 3 characters long' };
    }

    return null;
  }

  private static validateVocation(user: User): Validation | null {
    const { vocation } = user;
    if (!vocation || vocation == null) return { type: 400, message: '"vocation" is required' };
    if (typeof vocation !== 'string') return { type: 422, message: '"vocation" must be a string' };
    if (vocation.length <= 2) {
      return { type: 422, message: '"vocation" length must be at least 3 characters long' };
    }
    return null;
  }

  private static validateLevel(user: User): Validation | null {
    const { level } = user;
    if (level <= 0) {
      return { type: 422, message: '"level" must be greater than or equal to 1' };
    }
    if (!level) return { type: 400, message: '"level" is required' };
    if (typeof level !== 'number') return { type: 422, message: '"level" must be a number' };
    return null;
  }

  private static validatePassword(user: User): Validation | null {
    const { password } = user;
    if (!password || password == null) return { type: 400, message: '"password" is required' };
    if (typeof password !== 'string') return { type: 422, message: '"password" must be a string' };
    if (password.length < 8) {
      return { type: 422, message: '"password" length must be at least 8 characters long' };
    }
    return null;
  }

  private static allValidations(user: User): Validation | null {
    const isUserNameValid = UserService.validateUserName(user);
    if (isUserNameValid !== null) return isUserNameValid;

    const isVocationValid = UserService.validateVocation(user);
    if (isVocationValid !== null) return isVocationValid;

    const isLevelValid = UserService.validateLevel(user);
    if (isLevelValid !== null) return isLevelValid;

    const isPasswordValid = UserService.validatePassword(user);
    if (isPasswordValid !== null) return isPasswordValid;

    return null;
  }

  public async create(user: User): Promise<Validation> {
    const isAllFieldsValid = UserService.allValidations(user);
    if (isAllFieldsValid !== null) return isAllFieldsValid;

    const newUser = await this.model.create(user);
    const userWithoutPassword = { ...newUser, password: '' };

    const tokenGenerator = new Token();
    const token = await tokenGenerator.getToken(userWithoutPassword);
    return { type: 201, message: token };
  }
}