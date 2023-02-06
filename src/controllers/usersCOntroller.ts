import { Request, Response } from 'express';
import { User } from '../interfaces/userInterface';
import UserService from '../services/userService';

export default class UserController {
  constructor(private userService = new UserService()) {}

  public create = async (req: Request, res: Response): Promise<Response> => {
    const user: User = req.body;
    const { type, message } = await this.userService.create(user);
    if (type !== 201) return res.status(type).json({ message });
    return res.status(type).json({ token: message });
  };
}