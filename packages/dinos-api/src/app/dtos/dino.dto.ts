import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsTaxId } from 'class-validator';

export class DinoDto {
  @ApiProperty({ description: 'Dino name', required: true, example: 'T-Rex' })
  name: string;

  @ApiProperty({
    description: 'Does it have feathers?',
    required: true,
    example: 'true',
  })
  @IsBoolean()
  hasFeathers: boolean;

  @ApiProperty({
    description: 'For when it retires.',
    required: true,
    example: '23-1234567',
  })
  @IsTaxId()
  taxId: string;
}
