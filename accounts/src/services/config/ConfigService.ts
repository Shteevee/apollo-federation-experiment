import { injectable } from 'inversify';

export const ConfigServiceType = Symbol.for('ConfigService');

@injectable()
class ConfigService {
  env: NodeJS.ProcessEnv;

  constructor() {
    this.env = { ...process.env };
  }

  getEnvVar(key: string): string {
    const envVar = this.env[key];
    if (!envVar) {
      throw new Error(`Environment variable (${key}) could not be found`);
    }
    return envVar;
  }

  getJwtSecret(): string {
    return this.getEnvVar('JWT_SECRET');
  }
}

export default ConfigService;
