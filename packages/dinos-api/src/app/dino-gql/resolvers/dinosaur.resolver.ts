import { Inject } from '@nestjs/common';
import {
  Args,
  Field,
  Float,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Dinosaur } from '../models/dinosaur.model';
import { DinosaurService } from '../services/dinosaur.service';

@InputType()
class DinosaurCreateInput implements Prisma.DinosaurCreateInput {
  @Field()
  name: string;
  @Field()
  genus: string;
  @Field()
  species: string;
  @Field(() => Float)
  weightInKilos: number;
  @Field(() => Float)
  heightInMeters: number;
  @Field()
  hasFeathers: boolean;
}

@Resolver(Dinosaur)
export class DinosaurResolver {
  constructor(
    @Inject(DinosaurService) private readonly _dinoService: DinosaurService,
  ) {}

  @Query(() => [Dinosaur], { nullable: true })
  async allDinosaurs() {
    return this._dinoService.dinosaurs();
  }

  @Mutation(() => Dinosaur) async createDino(
    @Args('dino', { type: () => DinosaurCreateInput })
    dino: Prisma.DinosaurCreateInput,
  ): Promise<Dinosaur> {
    return this._dinoService.createDinosaur(dino);
  }
}
