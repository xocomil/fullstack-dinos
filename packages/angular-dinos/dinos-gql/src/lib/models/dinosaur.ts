import { z } from 'zod';

export const baseDinoParser = z.object({
  id: z.string().optional(),
  name: z
    .string({
      invalid_type_error: 'Name must be a string.',
      required_error: 'Name is required.',
    })
    .min(3, { message: 'Name must be at least 3 characters long.' }),
  genus: z
    .string({
      invalid_type_error: 'Genus must be a string.',
      required_error: 'Genus is required.',
    })
    .min(3, { message: 'Genus must be at least 3 characters long.' }),
  species: z
    .string({
      invalid_type_error: 'Species must be a string.',
      required_error: 'Species is required.',
    })
    .min(3, { message: 'Species must be at least 3 characters long.' }),
  hasFeathers: z.boolean({
    invalid_type_error: 'Has feathers must be a boolean value.',
    required_error: 'Has feathers is required.',
  }),
  description: z.string().optional(),
});

export type BaseDinosaur = z.infer<typeof baseDinoParser>;

export const dinoParser = baseDinoParser.extend({
  heightInMeters: z
    .number({ invalid_type_error: 'Height in meters must be a number.' })
    .gt(0, { message: 'Height in meters must be greater than 0.' })
    .nullish(),
  weightInKilos: z
    .number({ invalid_type_error: 'Weight in kilos must be a number.' })
    .gt(0, { message: 'Weight in kilos must be greater than 0.' })
    .nullish(),
  trivia: z.array(
    z
      .string({
        invalid_type_error: 'A trivia item must be a string',
        required_error: 'You cannot provide empty trivia.',
      })
      .min(3, {
        message:
          'You cannot provide empty trivia items. Must be at least 3 characters.',
      }),
    { required_error: 'Trivia is required.' },
  ),
  imageUrl: z
    .string({ invalid_type_error: 'Image URL must be a string.' })
    .url('Image URL is not a valid URL.')
    .optional(),
  updatedAt: z
    .date({ invalid_type_error: 'Updated At must be a date.' })
    .optional(),
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
