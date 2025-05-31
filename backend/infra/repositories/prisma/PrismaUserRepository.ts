import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, UserHealthCondition } from "../../domain/entities/User";

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository {
  async createUser(user: User): Promise<User> {
    const createdUser = await prisma.users.create({
      data: {
        email: user.email,
        photo: user.photo,
        name: user.name,
        birthyear: user.birthyear,
        gender: user.gender,
        member_type: user.member_type || 0,
        hpid: user.hpid,
      },
    });
    return createdUser;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        email: user.email,
        photo: user.photo,
        name: user.name,
        birthyear: user.birthyear,
        gender: user.gender,
        member_type: user.member_type,
        hpid: user.hpid,
      },
    });
    return updatedUser;
  }

  async saveHealthConditions(userId: string, healthConditions: UserHealthCondition): Promise<void> {
    const healthMapping: Record<string, number> = {
      pregnent: 1,
      allergy: 2,
      hypertension: 3,
      diabetes: 4,
      heartDisease: 5,
      liverDisease: 6,
      kidneyDisease: 7
    };

    const healthEntries = Object.entries(healthConditions)
      .filter(([key, value]) => value !== 0 && value !== undefined)
      .map(([key]) => ({
        userId,
        healthId: healthMapping[key],
      }));

    if (healthEntries.length > 0) {
      await prisma.user_healths.createMany({
        data: healthEntries,
      });
    }
  }

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  }
}