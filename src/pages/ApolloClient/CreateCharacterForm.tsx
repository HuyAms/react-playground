import {Button} from '@mui/material';
import {CREATE_CHARACTER, GET_CHARACTER, GET_CHARACTERS} from './query';
import {gql, useApolloClient, useMutation} from '@apollo/react-hooks';

export function CreateCharacterForm() {
  const client = useApolloClient();

  const [createCharacter, {loading}] = useMutation(CREATE_CHARACTER, {
    update: (cache, {data: {createCharacter}}) => {
      cache.modify({
        fields: {
          characters: existingData => {
            const newCharacterRef = cache.writeFragment({
              data: {
                ...createCharacter,
                episode: [],
              },
              fragment: gql`
                fragment NewCharacter on Character {
                  id
                  name
                  gender
                  episode
                  __typename
                }
              `,
            });

            return {
              ...existingData,
              results: [...existingData.results, newCharacterRef],
            };
          },
        },
      });
      // cache.writeQuery({
      //     query: GET_CHARACTERS,
      //     data: { characters: [...data.characters, data.createCharacter] }
      // });
    },
  });

  function formAction(formData: FormData) {
    const name = formData.get('name');
    const gender = formData.get('gender');
    createCharacter({variables: {name: name as string, gender: gender as string}});
  }

  function fetchCache() {
    client.cache.modify({
      id: client.cache.identify({
        __typename: 'Character',
        id: '122',
      }),
      fields: {
        episode(cachedName) {
          console.log('cachedName: ', cachedName);
          return cachedName;
        },
      },
    });
  }

  return (
    <div>
      <form action={formAction}>
        <div className="flex flex-col gap-4">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            required
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="gender">Gender</label>
          <input
            id="gender"
            name="gender"
            type="text"
            placeholder="Gender"
            required
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>

      <Button onClick={fetchCache}>Fetch cache</Button>
    </div>
  );
}
