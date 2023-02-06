import * as jwt from 'jsonwebtoken';
import { User } from '../interfaces/userInterface';

const secret = process.env.JWT_SECRET || 'batatinha';

export default class Token {
  public getToken = async (user: User): Promise<string> => {
    const jwtToken = jwt.sign({ user }, secret, { 
      algorithm: 'HS256', 
      expiresIn: '1d',
    });
    return jwtToken;
  };

  public validateToken = async (token: string) => {
    try {
      const tokenVerify: (string | jwt.JwtPayload) = jwt.verify(token, secret);
      return tokenVerify as jwt.JwtPayload;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}