import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Dinosaur as IDinosaur } from '@prisma/client';
import { IsUUID } from 'class-validator';

@ObjectType()
export class Dinosaur implements IDinosaur {
  @Field({ nullable: true })
  @IsUUID()
  id: string;
  @Field()
  name: string;
  @Field(() => String, { nullable: true })
  genus: string | null;
  @Field(() => String, { nullable: true })
  species: string | null;
  @Field(() => String, { nullable: true })
  description: string | null;
  @Field()
  hasFeathers: boolean;
  @Field(() => Float)
  weightInKilos: number;
  @Field(() => Float)
  heightInMeters: number;
  @Field(() => String, { nullable: true })
  imageUrl: string | null;
  @Field(() => [String], { nullable: true })
  trivia: string[];
  @Field({ nullable: true })
  updatedAt: Date;
}
