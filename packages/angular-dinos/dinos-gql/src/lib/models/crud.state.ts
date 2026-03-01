import { BaseDinosaur } from './dinosaur';

export type DinosCrudState = {
  dinosaurs: BaseDinosaur[];
  sortAscending: boolean;
  hasFeathersFilter?: '' | 'true' | 'false';
};

export const emptyDinosCrudState = (): DinosCrudState => ({
  dinosaurs: [],
  sortAscending: true,
  hasFeathersFilter: '',
});
