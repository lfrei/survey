import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';

// https://www.apollographql.com/docs/react/data/subscriptions/

const wsUrl = 'ws://localhost:8080/subscriptions';
const httpUrl = 'http://localhost:8080/query';

const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: httpUrl
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default client;