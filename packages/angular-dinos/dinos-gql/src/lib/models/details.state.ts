import { Dinosaur, createEmptyDino } from './dinosaur';

export type DetailsState = {
  id: string | undefined;
  editMode: boolean;
  dinosaur: Dinosaur;
  errors: Partial<Record<keyof Dinosaur, string>>;
  savePending: boolean;
  networkError: string | undefined;
};

export const emptyState = (): DetailsState => ({
  id: undefined,
  editMode: false,
  dinosaur: createEmptyDino(),
  errors: {},
  savePending: false,
  networkError: undefined,
});
