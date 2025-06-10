import {ApolloLink, Observable} from '@apollo/react-hooks';

export const mockLink = new ApolloLink((operation, forward) => {
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
