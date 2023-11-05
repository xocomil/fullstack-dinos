import { gql } from 'apollo-angular';

export const dinoDetailsFragment = gql`
  fragment DinoDetails on Dinosaur {
    id
    name
    genus
    species
    description
    hasFeathers
    heightInMeters
    weightInKilos
    imageUrl
    trivia
    updatedAt
  }
`;

export const DinosGqlQueries = {
  allDinosQuery: gql`
    query AllDinosaurs($direction: String, $hasFeathers: Boolean) {
      allDinosaurs(direction: $direction, hasFeathers: $hasFeathers) {
        id
        name
        genus
        species
        hasFeathers
        description
      }
    }
  `,
  getDinoQuery: gql`
    query Dino($where: DinosaurWhereUniqueInput!) {
      dinosaur(where: $where) {
        ...DinoDetails
      }
    }
    ${dinoDetailsFragment}
  `,
  createDino: gql`
    mutation CreateDino($dino: DinosaurCreateInput!) {
      createDino(dino: $dino) {
        ...DinoDetails
      }
    }
    ${dinoDetailsFragment}
  `,
} as const;
