import { Pool, ResultSetHeader } from 'mysql2/promise';
import { User } from '../interfaces/userInterface';

export default class UserModel {
  public connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async create(user: User): Promise<User> {
    const { username, vocation, level, password } = user;
    const [{ insertId }] = await this.connection.execute<ResultSetHeader>(
      'INSERT INTO Trybesmith.users (username, vocation, level, password) VALUES (?,?,?,?)',
      [username, vocation, level, password],
    );
    return { id: insertId, ...user };
  }
}