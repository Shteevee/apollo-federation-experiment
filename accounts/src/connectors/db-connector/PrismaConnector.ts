import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { DBConnector } from './DBConnector';

const prisma = new PrismaClient();

@injectable()
class PrismaConnector implements DBConnector {
  client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  getClient(): PrismaClient {
    return this.client;
  }
}

export default PrismaConnector;
