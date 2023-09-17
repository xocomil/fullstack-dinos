import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { BaseDinosaur, Dinosaur, UpdateDinosaur } from './models/dinosaur';

const allDinosQuery = gql<{ allDinosaurs: BaseDinosaur[] }, void>`
  query AllDinosaurs {
    allDinosaurs {
      id
      name
      genus
      species
      hasFeathers
      description
    }
  }
`;

const dinoDetailsFragment = gql`
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

@Injectable({
  providedIn: 'root',
})
export class DinosCrudService {
  readonly #apollo = inject(Apollo);

  getDinosTable(): Observable<{ allDinosaurs: BaseDinosaur[] }> {
    return this.#apollo
      .query({
        query: allDinosQuery,
      })
      .pipe(map((apolloDinos) => apolloDinos.data));
  }

  getDino(id: string): Observable<Dinosaur> {
    return this.#apollo
      .query({
        query: gql<{ dinosaur: Dinosaur }, { where: { id: string } }>`
          query Dino($where: DinosaurWhereUniqueInput!) {
            dinosaur(where: $where) {
              ...DinoDetails
            }
          }
          ${dinoDetailsFragment}
        `,
        variables: { where: { id } },
      })
      .pipe(map((apolloDino) => apolloDino.data.dinosaur));
  }

  updateDino(
    dino: UpdateDinosaur,
    id: string,
  ): Observable<Dinosaur | null | undefined> {
    return this.#apollo
      .mutate({
        mutation: gql<
          Dinosaur,
          { data: UpdateDinosaur; where: { id?: string; name?: string } }
        >`
          mutation Mutation(
            $data: DinosaurUpdateInput!
            $where: DinosaurWhereUniqueInput!
          ) {
            updateDino(data: $data, where: $where) {
              ...DinoDetails
            }
          }
          ${dinoDetailsFragment}
        `,
        variables: {
          data: dino,
          where: { id },
        },
      })
      .pipe(map((mutationResult) => mutationResult.data));
  }

  create(dino: Dinosaur): Observable<Dinosaur | null | undefined> {
    return this.#apollo
      .mutate({
        mutation: gql<Dinosaur, { dino: Dinosaur }>`
          mutation CreateDino($dino: DinosaurCreateInput!) {
            createDino(dino: $dino) {
              id
            }
          }
        `,
        variables: {
          dino: dino,
        },
        refetchQueries: [{ query: allDinosQuery }],
        awaitRefetchQueries: true,
      })
      .pipe(map((mutationResult) => mutationResult.data));
  }
}
