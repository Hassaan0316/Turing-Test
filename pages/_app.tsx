import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SubscriptionClient } from 'subscriptions-transport-ws';

type UserType = {
  id: string;
  username: string;
};

interface AuthResponseType {
  access_token: string;
  user: UserType;
}

const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_HTTP_LINK ||
    'https://frontend-test-api.aircall.io/graphql',
  // credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const token = typeof window !== "undefined" && localStorage.getItem('token');
// console.log(token)
const wsLink =
  typeof window !== "undefined"
    ? new WebSocketLink(
      new SubscriptionClient('wss://frontend-test-api.aircall.io/websocket', {
        timeout: 30000,
        connectionParams: {
          authToken: localStorage.getItem('token'),
          headers: {
            authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        }
      })
    )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    )
    : httpLink;


export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});


export default function App({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
