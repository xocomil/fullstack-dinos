import { Dinosaur, createEmptyDino } from './dinosaur';

export type AddDinoState = {
  dinosaur: Dinosaur;
  savePending: boolean;
  networkError: string | undefined;
};

export const emptyAddDino = (): AddDinoState => ({
  dinosaur: createEmptyDino(),
  savePending: false,
  networkError: undefined,
});

export type EditDinoState = {
  id: string;
  editMode: boolean;
  dinosaur: Dinosaur;
  savePending: boolean;
  networkError: string | undefined;
};

export const emptyEditDino = (): EditDinoState => ({
  id: '',
  editMode: false,
  dinosaur: createEmptyDino(),
  savePending: false,
  networkError: undefined,
});
