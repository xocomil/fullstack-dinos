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
  @Field({ nullable: true })
  genus: string | null;
  @Field({ nullable: true })
  species: string | null;
  @Field({ nullable: true })
  description: string | null;
  @Field()
  hasFeathers: boolean;
  @Field(() => Float)
  weightInKilos: number;
  @Field(() => Float)
  heightInMeters: number;
  @Field({ nullable: true })
  imageUrl: string | null;
  @Field(() => [String], { nullable: true })
  trivia: string[];
  @Field({ nullable: true })
  updatedAt: Date;
}
