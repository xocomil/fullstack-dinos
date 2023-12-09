import { Dinosaur, createEmptyDino } from './dinosaur';

export type DetailsState = {
  id: string | undefined;
  editMode: boolean;
  dinosaur: Dinosaur;
  savePending: boolean;
  networkError: string | undefined;
};

export const emptyState = (): DetailsState => ({
  id: undefined,
  editMode: false,
  dinosaur: createEmptyDino(),
  savePending: false,
  networkError: undefined,
});
