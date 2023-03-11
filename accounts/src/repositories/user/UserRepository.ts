import { injectable, inject } from 'inversify';
import { PrismaClient, User } from '@prisma/client';
import { DBConnector, DBConnectorType } from '../../connectors/db-connector/DBConnector';

export const UserRepositoryType = Symbol.for('UserRepository');

@injectable()
class UserRepository {
  prisma: PrismaClient;

  constructor(
    @inject(DBConnectorType) prismaService: DBConnector,
  ) {
    this.prisma = prismaService.getClient();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user;
  }

  async createUser(email: string, username: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email, username, password, emailConfirmed: false,
      },
    });
  }
}

export default UserRepository;
