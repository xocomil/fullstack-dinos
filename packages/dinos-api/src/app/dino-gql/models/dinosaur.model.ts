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
  @Field()
  genus: string;
  @Field()
  species: string;
  @Field({ nullable: true })
  description: string;
  @Field()
  hasFeathers: boolean;
  @Field(() => Float)
  weightInKilos: number;
  @Field(() => Float)
  heightInMeters: number;
  @Field({ nullable: true })
  imageUrl: string;
  @Field(() => [String], { nullable: true })
  trivia: string[];
  @Field({ nullable: true })
  updatedAt: Date;
}
