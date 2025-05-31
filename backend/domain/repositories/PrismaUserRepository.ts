import { User, UserHealthCondition } from "../entities/User";

export interface UserRepository {
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  saveHealthConditions(userId: string, healthConditions: UserHealthCondition): Promise<void>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}