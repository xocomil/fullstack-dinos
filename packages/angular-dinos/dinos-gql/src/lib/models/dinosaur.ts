export type BaseDinosaur = {
  id?: string;
  name: string;
  genus: string;
  species: string;
  hasFeathers: boolean;
  description?: string;
};

export type Dinosaur = BaseDinosaur & {
  trivia?: string[];
};
