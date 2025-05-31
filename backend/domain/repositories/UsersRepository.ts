import { User } from '../entities/UsersEntity';

export interface UsersRepository {
  createUser(user: User): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
}