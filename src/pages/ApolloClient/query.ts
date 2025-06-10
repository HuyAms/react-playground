import {gql} from '@apollo/client';

export const CHARACTER_FRAGMENT = gql`
  fragment CharacterFragment on Character {
    id
    episode {
      id
      episode
      name
    }
    name
    gender
  }
`;
export const GET_CHARACTERS = gql`
  query Characters($page: Int) {
    characters(page: $page) {
      results {
        ...CharacterFragment
      }
    }
  }

  ${CHARACTER_FRAGMENT}
`;

export const GET_CHARACTER = gql`
  query Character($characterId: ID!) {
    character(id: $characterId) {
      ...CharacterFragment
      status
    }
  }
  ${CHARACTER_FRAGMENT}
`;

// This mutation is defined here but we're using a local mock implementation
// in the CreateCharacterForm component instead of Apollo Client
export const CREATE_CHARACTER = gql`
  mutation CreateCharacter($name: String!, $gender: String!) {
    createCharacter(name: $name, gender: $gender) {
      ...CharacterFragment
    }
  }
  ${CHARACTER_FRAGMENT}
`;
