import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';


const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type Query {
    project: Project!
  }

  type Project {
    id: ID!
    name: String
  }
`;

const resolvers = {
  Query: {
    project() {
      return { id: 'project-id', name: 'project 1' };
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const port = process.env.PROJECTS_API_PORT;

startStandaloneServer(
    server,
    {
        listen: { port: port ? parseInt(port, 10) : 4050 },
    },
).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
} );