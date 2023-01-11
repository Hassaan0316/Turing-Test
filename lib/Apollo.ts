import {getMainDefinition} from '@apollo/client/utilities';
import {createClient} from 'graphql-ws';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import Cookies from 'js-cookie';

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
  credentials: 'same-origin',
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url:
            process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT ||
            'wss://frontend-test-api.aircall.io/websocket',
        }),
      )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({query}) => {
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
