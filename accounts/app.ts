import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';
import { startStandaloneServer } from '@apollo/server/standalone';

import ioc from './src/inversify.config';
import { resolvers, typeDefs } from './src/graphql/schema';

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers: resolvers as GraphQLResolverMap<unknown> }),
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
