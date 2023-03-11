import { injectable, inject } from 'inversify';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import Boom from '@hapi/boom';
import { User } from '@prisma/client';
import UserDomain, { UserDomainType } from '../../domains/user/UserDomain';
import ConfigService, { ConfigServiceType } from '../config/ConfigService';

const EMAIL_VALIDATION = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const AuthServiceType = Symbol.for('AuthService');

export type AuthTokens = {
    token: string,
    refreshToken: string,
}

interface TokenPayload extends JwtPayload {
    id?: string,
    username?: string,
}

export type VerifyTokenResult = TokenPayload;

@injectable()
class AuthService {
  userDomain: UserDomain;

  configService: ConfigService;

  constructor(
    @inject(UserDomainType) userDomain: UserDomain,
    @inject(ConfigServiceType) configService: ConfigService,
  ) {
    this.userDomain = userDomain;
    this.configService = configService;
  }

  createAuthToken(user: User): string {
    const { id, username } = user;
    const options: SignOptions = {
      expiresIn: '1h',
      algorithm: 'HS256',
    };

    const secret = this.configService.getJwtSecret();
    const token = jwt.sign({ id, username }, secret, options);

    return token;
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    if (!username || !username.trim()) {
      throw Boom.badData('username must not be empty');
    }

    if (!password || !password.trim()) {
      throw Boom.badData('password must not be empty');
    }

    const user = await this.userDomain.getUserByUsername(username);

    if (!user) {
      throw Boom.unauthorized('User not found');
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      throw Boom.unauthorized('Password incorrect');
    }

    const token = this.createAuthToken(user);

    return {
      token,
      refreshToken: 'refreshToken',
    };
  }

  verifyToken(token: string): VerifyTokenResult {
    const secret = this.configService.getJwtSecret();
    const payload = jwt.verify(token, secret);

    if (typeof payload === 'string') {
      throw new Error('Could not verify a token of this format!');
    }

    return payload;
  }

  async signUp(email: string, username: string, password: string): Promise<User> {
    if (!email || !email.match(EMAIL_VALIDATION)) {
      throw Boom.badData('invalid email');
    }

    if (!username || !username.trim()) {
      throw Boom.badData('invalid username');
    }

    if (!password || !password.match(PASSWORD_VALIDATION)) {
      throw Boom.badData('invalid password');
    }

    await this.userDomain.checkUserExists(email, username);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return this.userDomain.createUser(email, username, hashedPassword);
    } catch (err) {
      throw Boom.internal('could not create user at this time');
    }
  }
}

export default AuthService;
