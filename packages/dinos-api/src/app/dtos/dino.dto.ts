import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsTaxId } from 'class-validator';

export class DinoDto {
  @ApiProperty({ description: 'Dino name', required: true, example: 'T-Rex' })
  @IsDefined({ message: 'Dino name is required' })
  name: string;

  @ApiProperty({
    description: 'Does it have feathers?',
    required: true,
    example: 'true',
  })
  @IsBoolean({
    message:
      'Incorrect value for hasFeathers. It should be boolean true or false.',
  })
  hasFeathers: boolean;

  @ApiProperty({
    description: 'For when it retires.',
    required: true,
    example: '23-1234567',
  })
  @IsTaxId()
  taxId: string;
}
