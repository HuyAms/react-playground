import {ApolloClient, InMemoryCache, HttpLink, ApolloLink} from '@apollo/client';
import {Observable} from '@apollo/react-hooks';

const mockLink = new ApolloLink((operation, forward) => {
  if (operation.operationName === 'CreateCharacter') {
    return new Observable(observer => {
      observer.next({
        data: {
          createCharacter: {
            __typename: 'Character',
            id: crypto.randomUUID(),
            name: operation.variables.name,
            gender: operation.variables.gender,
          },
        },
      });
      observer.complete();
    });
  }

  // fallback for other operations (error or passthrough)
  return forward(operation);
});

const httpLink = new HttpLink({uri: 'https://rickandmortyapi.com/graphql'});

export const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          characters: {
            // Don't cache separate results based on
            // any of this field's arguments
            keyArgs: false,
            merge(existing, incoming) {
              const existingResults = existing?.results || [];

              return {
                ...incoming,
                results: [...existingResults, ...incoming.results],
              };
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([mockLink, httpLink]),
});
