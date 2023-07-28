import { ApiProperty } from '@nestjs/swagger';

export class GetHelloResponse {
  @ApiProperty({ example: 't-rex' })
  hello: string;
}
