import { Pool, RowDataPacket } from 'mysql2/promise';
import { Login } from '../interfaces/loginInterface';
import { User } from '../interfaces/userInterface';

export default class LoginModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async getUser(login: Login): Promise<User> {
    const { username, password } = login;
    const [result] = await this.connection.execute<RowDataPacket[] & User[]>(
      'SELECT * FROM Trybesmith.users WHERE username = ? AND password = ?',
      [username, password],
    );

    return result[0];
  }
}