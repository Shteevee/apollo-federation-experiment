import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway } from '@apollo/gateway';
import { watch } from 'fs';
import { readFile } from 'fs/promises';

// Initialize an ApolloGateway instance 
const gateway = new ApolloGateway({
  async supergraphSdl({ update, healthCheck }) {
    const watcher = watch('./supergraph.graphql');
    // subscribe to file changes
    watcher.on('change', async () => {
      // update the supergraph schema
      try {
        const updatedSupergraph = await readFile('./supergraph.graphql', 'utf-8');
        await healthCheck(updatedSupergraph);
        update(updatedSupergraph);
      } catch (e) {
        console.error(e);
      }
    });

    return {
      supergraphSdl: await readFile('./supergraph.graphql', 'utf-8'),
      async cleanup() {
        watcher.close();
      },
    };
  },
});

const server = new ApolloServer({
  gateway,
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
