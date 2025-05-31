import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/repositories/UserRepository";

export class DetailUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: User): Promise<User> {
    const savedUser = await this.userRepository.createUser({
      email: userData.email,
      photo: userData.photo,
      name: userData.name,
      birthyear: userData.birthyear,
      member_type: userData.member_type,
      hpid: userData.hpid,
    });
    
    return savedUser;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(userId, userData);
    return updatedUser;
  }
}