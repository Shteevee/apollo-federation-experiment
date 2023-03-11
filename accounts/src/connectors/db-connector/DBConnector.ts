import { PrismaClient } from '@prisma/client';

export interface DBConnector {
    getClient(): PrismaClient
}

export const DBConnectorType = Symbol.for('DBConnector');
