import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import ioc from './src/inversify.config';
import { resolvers, typeDefs } from './src/graphql/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = process.env.ACCOUNTS_API_PORT;

startStandaloneServer(
  server,
  {
    context: async () => ({ ioc }),
    listen: { port: port ? parseInt(port, 10) : 4000 },
  },
).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
