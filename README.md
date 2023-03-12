# apollo-federation-experiment

A small test case to try out [Apollo Federation](https://www.apollographql.com/docs/federation/).

## Getting started

- Run ```yarn install``` in ```/accounts```, ```/projects```, and ```/gateway```
- Create a ```.env``` file with the same contents as ```.env.sample``` in both the root dir and ```/accounts/prisma```
- Run ```yarn db generate``` in ```/accounts``` to create the prisma client
- Run ```docker-compose up``` in the root dir to spin up the containers
- Run ```yarn db migrate dev``` in ```/accounts``` to run the prisma migrations

## Expanding the supergraph

You'll need [Rover CLI](https://www.apollographql.com/docs/rover/) to add another subgraph to the supergraph. This can be done by editting
```/gateway/supergraph-config.yml``` and then running ```rover supergraph compose --config ./supergraph-config.yaml > supergraph.graphql```
to create a new supergraph schema.

## Things to do
- Look at adding auth protected resolvers across the whole supergraph with directives
