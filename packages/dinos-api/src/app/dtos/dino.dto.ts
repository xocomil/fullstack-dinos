import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class DinoDto {
  @ApiProperty({ description: 'Dino name', required: true, example: 'T-Rex' })
  @IsDefined({ message: 'Dino name is required' })
  name: string;

  @ApiProperty({
    description: 'Does it have feathers?',
    example: 'true',
    required: false,
  })
  hasFeathers?: boolean;

  @ApiProperty({
    description: 'Dino genus',
    example: 'Tyrannosaurus',
    required: false,
  })
  genus?: string;

  @ApiProperty({
    description: 'Dino species',
    example: 'rex',
    required: false,
  })
  species?: string;

  @ApiProperty({
    description: 'Dino height in meters',
    example: 4.15,
    required: false,
    minimum: 0,
  })
  heightInMeters?: number;

  @ApiProperty({
    description: 'Dino length in meters',
    example: 4.15,
    required: false,
    minimum: 0,
  })
  lengthInMeters?: number;

  @ApiProperty({
    description: 'Dino weight in kilograms',
    example: 1000,
    required: false,
    minimum: 0,
  })
  weightInKilos?: number;

  @ApiProperty({
    description: 'Description of dinosaur.',
    example: 'A large, carnivorous dinosaur.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Trivia about dinosaur.',
    example: ['Tyrannosaurus rex means "king of the tyrant lizards".'],
    required: false,
    isArray: true,
  })
  trivia?: string[];
}
