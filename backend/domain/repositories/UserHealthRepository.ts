import { UserHealth } from '../entities/UserHealthEntity';

export interface UserHealthRepository {
  saveHealth(healthData: UserHealth[]): Promise<void>;
  findHealthByUserId(userId: string): Promise<UserHealth[]>;
}