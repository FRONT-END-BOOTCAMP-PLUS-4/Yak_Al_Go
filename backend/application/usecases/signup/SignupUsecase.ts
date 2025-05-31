import { UserHealthCondition } from "@/domain/entities/User";
import { UserRepository } from "../domain/repositories/UserRepository";

export class HealthConditionSignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, healthData: UserHealthCondition): Promise<void> {
    await this.userRepository.saveHealthConditions(userId, healthData);
  }

  private filterNonZeroHealthConditions(healthData: UserHealthCondition): UserHealthCondition {
    const filtered: UserHealthCondition = {};
    
    Object.entries(healthData).forEach(([key, value]) => {
      if (value !== 0 && value !== undefined) {
        (filtered as any)[key] = value;
      }
    });
    
    return filtered;
  }
}