import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDinoInput {
  @Field()
  id: string;

  @Field()
  name: string;
}
