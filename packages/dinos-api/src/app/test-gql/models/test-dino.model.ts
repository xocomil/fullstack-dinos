import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'This represents a Dinosaur' })
export class TestDino {
  @Field(() => ID, {
    description: 'This represents the id of the Dinosaur',
    nullable: true,
  })
  id?: string;
  @Field(() => String, {
    description: 'This represents the name of the Dinosaur',
  })
  name: string;
  @Field(() => Boolean, { description: 'Does it have feathers?' })
  hasFeathers: boolean;
}
