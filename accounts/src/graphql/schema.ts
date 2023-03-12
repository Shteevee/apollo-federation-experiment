import { Container } from 'inversify';
import 'graphql-import-node';
import schema from './schema.graphql';
import AuthService, { AuthServiceType } from '../services/auth/AuthService';
import { GraphqlContext } from './types';

type SignUpArgs = {
    email: string,
    username: string,
    password: string,
}

type LoginArgs = {
    username: string,
    password: string,
}

function authService(ioc: Container): AuthService {
  return ioc.get<AuthService>(AuthServiceType);
}

export const resolvers = {
  Mutation: {
    signUp: (
      parent: unknown,
      { email, username, password }: SignUpArgs,
      { ioc }:GraphqlContext,
    ) => authService(ioc).signUp(email, username, password),
    login: (
      parent: unknown,
      { username, password }: LoginArgs,
      { ioc }: GraphqlContext,
    ) => authService(ioc).login(username, password),
  },
};

export const typeDefs = schema;
