export type BaseDinosaur = {
  id?: string;
  name: string;
  genus: string;
  species: string;
  hasFeathers: boolean;
  description?: string;
};

export type Dinosaur = BaseDinosaur & {
  heightInMeters: number;
  weightInKilos: number;
  trivia?: string[];
  imageUrl?: string;
  updatedAt?: Date;
};

export const createEmptyDino = (): Dinosaur => ({
  name: '',
  genus: '',
  species: '',
  hasFeathers: false,
  description: '',
  heightInMeters: 0,
  weightInKilos: 0,
  trivia: [],
});
