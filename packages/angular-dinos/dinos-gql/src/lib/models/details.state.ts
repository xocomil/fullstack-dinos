import { createEmptyDino, Dinosaur } from './dinosaur';

export type AddDinoState = {
  dinosaur: Dinosaur;
  networkError: string | undefined;
};

export const emptyAddDino = (): AddDinoState => ({
  dinosaur: createEmptyDino(),
  networkError: undefined,
});

export type EditDinoState = {
  id: string;
  editMode: boolean;
  dinosaur: Dinosaur;
  networkError: string | undefined;
};

export const emptyEditDino = (): EditDinoState => ({
  id: '',
  editMode: false,
  dinosaur: createEmptyDino(),
  networkError: undefined,
});
