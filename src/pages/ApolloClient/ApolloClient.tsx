import {useQuery} from '@apollo/react-hooks';
import {GET_CHARACTERS, GET_CHARACTER} from './query';
import {Button, Typography} from '@mui/material';
import {useState} from 'react';
import {CreateCharacterForm} from './CreateCharacterForm';

const INITIAL_PAGE = 1;

export default function ApolloClientPage() {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [page, setPage] = useState(INITIAL_PAGE);
  const {
    loading: charactersLoading,
    error: charactersError,
    data: charactersData,
    fetchMore,
  } = useQuery(GET_CHARACTERS, {
    variables: {
      page: INITIAL_PAGE,
    },
  });

  const {
    loading: characterLoading,
    error: characterError,
    data: characterData,
  } = useQuery(GET_CHARACTER, {
    variables: {
      characterId: selectedCharacterId,
    },
    skip: !selectedCharacterId,
  });

  if (charactersLoading) return <p>Loading...</p>;
  if (charactersError) return <p>Error: {charactersError.message}</p>;

  const renderSelectedCharacter = () => {
    if (characterLoading) return <p>Loading...</p>;
    if (characterError) return <p>Error: {characterError.message}</p>;

    if (!characterData) return <p>No character selected</p>;

    return (
      <div>
        <p>Name: {characterData.character.name}</p>
        <p>Gender: {characterData.character.gender}</p>
        <p>Status: {characterData.character.status}</p>
      </div>
    );
  };

  return (
    <div className="flex gap-5">
      <div>
        <Typography variant="h4">Characters</Typography>
        <ul className="max-h-[300px] overflow-y-auto">
          {charactersData.characters.results.map(character => (
            // eslint-disable-next-line prettier/prettier
            <li key={character.id}>
              <button onClick={() => setSelectedCharacterId(character.id)}>{character.name}</button>
            </li>
          ))}
        </ul>
        <Button
          onClick={() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMore({
              variables: {
                page: nextPage,
              },
            });
          }}
        >
          Fetch More
        </Button>
      </div>
      <div>
        <div className="mb-6">
          <Typography variant="h4">Selected Character</Typography>
          {renderSelectedCharacter()}
        </div>
        <div>
          <h1>Create Character</h1>
          <CreateCharacterForm />
        </div>
      </div>
    </div>
  );
}
