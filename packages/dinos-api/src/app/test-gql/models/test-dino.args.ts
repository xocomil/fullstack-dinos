import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TestDinoFilter {
  @Field({ nullable: true })
  hasFeathers?: boolean;
}

@ArgsType()
export class TestDinoArgs {
  @Field({ nullable: true })
  hasFeathers: boolean;
}
