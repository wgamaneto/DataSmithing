import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class OrderController {
  constructor(private loginService = new LoginService()) { }

  public getUser = async (req: Request, res: Response): Promise<Response> => {
    const login = req.body;
    const { type, message } = await this.loginService.getUser(login);

    if (type !== 200) return res.status(type).json({ message });

    return res.status(type).json({ token: message });
  };
}