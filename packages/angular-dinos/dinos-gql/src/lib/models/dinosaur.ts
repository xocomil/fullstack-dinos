import { z, ZodSafeParseResult } from 'zod';

export const baseDinoParser = z.object({
  id: z.string().nullable().optional(),
  dinoName: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Dinosaur name is required.'
          : 'Dinosaur name must be a string.',
    })
    .min(3, { message: 'Name must be at least 3 characters long.' }),
  genus: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Genus is required.'
          : 'Genus must be a string.',
    })
    .min(3, { message: 'Genus must be at least 3 characters long.' }),
  species: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Species is required.'
          : 'Species must be a string.',
    })
    .min(3, { message: 'Species must be at least 3 characters long.' }),
  hasFeathers: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? 'Has feathers is required.'
        : 'Has feathers must be a boolean value.',
  }),
  description: z
    .string()
    .min(3, {
      message:
        'Please provide a better description. It should be at least 3 characters!',
    })
    .or(z.string().max(0))
    .nullish(),
});

export type BaseDinosaur = z.infer<typeof baseDinoParser>;

export const dinoParser = baseDinoParser.extend({
  heightInMeters: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'Height in meters is required.'
          : 'Height in meters must be a number.',
    })
    .gt(0, { message: 'Height in meters must be greater than 0.' }),
  weightInKilos: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'Weight in kilos is required.'
          : 'Weight in kilos must be a number.',
    })
    .gt(0, { message: 'Weight in kilos must be greater than 0.' }),
  trivia: z.array(
    z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'A trivia item is required.'
            : 'A trivia item must be a string',
      })
      .min(3, {
        message:
          'You cannot provide empty trivia items. Must be at least 3 characters.',
      }),
    {
      error: (issue) =>
        issue.input === undefined
          ? 'Trivia is required.'
          : 'Trivia must be an array.',
    },
  ),
  imageUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Image URL is required.'
          : 'Image URL must be a string.',
    })
    .url('Image URL is not a valid URL.')
    .or(z.string().max(0))
    .nullish(),
  updatedAt: z
    .date({
      error: (issue) =>
        issue.input === undefined
          ? 'Updated At is required.'
          : 'Updated At must be a date.',
    })
    .optional(),
});

export type Dinosaur = z.infer<typeof dinoParser>;

export type OpenaiDino = Omit<Dinosaur, 'id' | 'updatedAt' | 'imageUrl'> & {
  lengthInMeters: number;
};

export const updateDinoParser = dinoParser.omit({
  dinoName: true,
  species: true,
  genus: true,
});

export type UpdateDinosaur = z.infer<typeof updateDinoParser>;

export const createEmptyBaseDino = (): BaseDinosaur => ({
  dinoName: '',
  genus: '',
  species: '',
  hasFeathers: false,
  description: '',
});

export const createEmptyDino = (): Dinosaur => ({
  ...createEmptyBaseDino(),
  heightInMeters: 0,
  weightInKilos: 0,
  trivia: [],
});

const formatDinoErrors = <T>(parseResults: ZodSafeParseResult<T>) =>
  parseResults.success
    ? {}
    : parseResults.error.issues.reduce(
        (acc, issue) => {
          return { ...acc, [issue.path[0]]: issue.message };
        },
        {} as Partial<Record<keyof Dinosaur, string>>,
      );

export const validateUpdateDino = (
  dino: UpdateDinosaur,
): Partial<Record<keyof UpdateDinosaur, string>> => {
  console.log('dino', dino);

  const dinoResult = updateDinoParser.safeParse(dino);

  // console.log('dinoResult', dinoResult);
  // if (!dinoResult.success) {
  //   console.log('dinoResult.error.issues', dinoResult.error.issues);
  //   console.log('dinoResult.error.formErrors', dinoResult.error.formErrors);
  //   console.log('dinoResult.error.flatten', dinoResult.error.flatten());
  //   console.log('dinoResult.error.formatted', dinoResult.error.format());
  // }
  return formatDinoErrors(dinoResult);
};

export const errorParser = z.object({
  message: z.string(),
});

export const validateDino = (
  dino: Dinosaur,
): Partial<Record<keyof Dinosaur, string>> => {
  console.log('dino', dino);

  const dinoResult = dinoParser.safeParse(dino);

  return formatDinoErrors(dinoResult);
};
