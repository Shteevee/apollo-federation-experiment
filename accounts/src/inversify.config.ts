import { Container } from 'inversify';
import 'reflect-metadata';

import { DBConnector, DBConnectorType } from './connectors/db-connector/DBConnector';
import PrismaConnector from './connectors/db-connector/PrismaConnector';
import UserDomain, { UserDomainType } from './domains/user/UserDomain';
import UserRepository, { UserRepositoryType } from './repositories/user/UserRepository';
import AuthService, { AuthServiceType } from './services/auth/AuthService';
import ConfigService, { ConfigServiceType } from './services/config/ConfigService';

const ioc = new Container();
ioc.bind<AuthService>(AuthServiceType).to(AuthService);
ioc.bind<ConfigService>(ConfigServiceType).to(ConfigService).inSingletonScope();
ioc.bind<UserDomain>(UserDomainType).to(UserDomain);
ioc.bind<UserRepository>(UserRepositoryType).to(UserRepository);
ioc.bind<DBConnector>(DBConnectorType).to(PrismaConnector);

export default ioc;
