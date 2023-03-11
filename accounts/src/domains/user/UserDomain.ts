import { injectable, inject } from 'inversify';
import Boom from '@hapi/boom';
import { User } from '@prisma/client';
import UserRepository, { UserRepositoryType } from '../../repositories/user/UserRepository';

export const UserDomainType = Symbol.for('UserDomain');

@injectable()
class UserDomain {
  userRepository: UserRepository;

  constructor(
    @inject(UserRepositoryType) userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.getUserByUsername(username);
  }

  async createUser(email: string, username: string, password: string): Promise<User> {
    return this.userRepository.createUser(email, username, password);
  }

  async checkUserExists(email: string, username: string): Promise<void> {
    const emailUser = await this.userRepository.getUserByEmail(email);
    const usernameUser = await this.userRepository.getUserByUsername(username);

    if (emailUser) {
      throw Boom.badData('The requested email is already in use');
    }
    if (usernameUser) {
      throw Boom.badData('The requested username is already in use');
    }
  }
}

export default UserDomain;
