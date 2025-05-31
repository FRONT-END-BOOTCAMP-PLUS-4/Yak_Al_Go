import { PrismaClient } from '@prisma/client';
import { UsersRepository } from '../../../domain/repositories/UsersRepository';
import { User } from '../../../domain/entities/UsersEntity';

export class PrismaUsersRepository implements UsersRepository {
    private prisma = new PrismaClient();

    async createUser(user: User): Promise<User> {
        try {
            const userData = await this.prisma.users.create({
                data: {
                    name: user.name,
                    email: user.email,
                    photo: user.photo,
                    birthyear: user.birthyear,
                    member_type: user.member_type,
                    hpid: user.hpid
                }
            });

            return new User(
                userData.id,
                userData.name,
                userData.email,
                userData.photo,
                userData.birthyear,
                userData.member_type,
                userData.hpid
            );
        } catch (error: any) {
            throw new Error(`사용자 생성 실패: ${error.message}`);
        }
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const userData = await this.prisma.users.findUnique({
                where: { id: userId }
            });

            if (!userData) return null;

            return new User(
                userData.id,
                userData.name,
                userData.email,
                userData.photo,
                userData.birthyear,
                userData.member_type,
                userData.hpid
            );
        } catch (error: any) {
            throw new Error(`사용자 조회 실패: ${error.message}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const userData = await this.prisma.users.findUnique({
                where: { email }
            });

            if (!userData) return null;

            return new User(
                userData.id,
                userData.name,
                userData.email,
                userData.photo,
                userData.birthyear,
                userData.member_type,
                userData.hpid
            );
        } catch (error: any) {
            throw new Error(`사용자 조회 실패: ${error.message}`);
        }
    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        try {
            const userData = await this.prisma.users.update({
                where: { id },
                data: {
                    name: user.name,
                    email: user.email,
                    photo: user.photo,
                    birthyear: user.birthyear,
                    member_type: user.member_type,
                    hpid: user.hpid
                }
            });

            return new User(
                userData.id,
                userData.name,
                userData.email,
                userData.photo,
                userData.birthyear,
                userData.member_type,
                userData.hpid
            );
        } catch (error: any) {
            throw new Error(`사용자 수정 실패: ${error.message}`);
        }
    }
}