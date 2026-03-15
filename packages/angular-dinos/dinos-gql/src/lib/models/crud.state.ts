import { BaseDinosaur } from './dinosaur';

export type DinosCrudState = {
  dinosaurs: BaseDinosaur[];
  sortAscending: boolean;
  hasFeathersFilterOptions: '' | 'true' | 'false';
};

export const emptyDinosCrudState = (): DinosCrudState => ({
  dinosaurs: [],
  sortAscending: true,
  hasFeathersFilterOptions: '',
});
