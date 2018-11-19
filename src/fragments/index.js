import gql from 'graphql-tag';

export const CollectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    name
    description
    numGames
  }
`;

export const GameFragment = gql`
  fragment GameFragment on Game {
    id
    name
    image {
      url
      width
      height
    }
    yearPublished
    minPlayers
    maxPlayers
    duration
  }
`;
