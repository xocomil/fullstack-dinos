import { Dinosaur } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { template } from '../../helpers/template-parser';

export const dinoDetails = {
  extraDescription: template`${'name'} was around
  ${'heightInMeters'} meters tall and weighed
  around ${'weightInKilos'} kilograms.
  ${'name'} did
  ${'not'} have feathers.`,
} as const;

export const extraDescriptionFromDino = (dinosaur: Dinosaur) =>
  dinoDetails.extraDescription({
    ...dinosaur,
    weightInKilos: Intl.NumberFormat().format(dinosaur.weightInKilos ?? 0),
    not: dinosaur.hasFeathers ? '' : 'not',
  });
