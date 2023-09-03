import { z } from 'zod';

export const baseDinoParser = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  genus: z.string().min(3),
  species: z.string().min(3),
  hasFeathers: z.boolean(),
  description: z.string().optional(),
});

export type BaseDinosaur = z.infer<typeof baseDinoParser>;

export const dinoParser = baseDinoParser.extend({
  heightInMeters: z.number().gt(0).nullable().optional(),
  weightInKilos: z.number().gt(0).nullable().optional(),
  trivia: z.array(z.string()),
  imageUrl: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type Dinosaur = z.infer<typeof dinoParser>;

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
