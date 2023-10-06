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
class DinosaurWhereUniqueInput {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  name: string;
}

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
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  imageUrl: string;
  @Field(() => [String], { nullable: true })
  trivia: string[];
}

@InputType()
class DinosaurUpdateInput implements Prisma.DinosaurUpdateInput {
  @Field(() => Float, { nullable: true })
  weightInKilos?: number;
  @Field(() => Float, { nullable: true })
  heightInMeters?: number;
  @Field({ nullable: true })
  hasFeathers?: boolean;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  imageUrl?: string;
  @Field(() => [String], { nullable: true })
  trivia?: string[];
}

@Resolver(Dinosaur)
export class DinosaurResolver {
  constructor(
    @Inject(DinosaurService) private readonly _dinoService: DinosaurService,
  ) {}

  @Query(() => Dinosaur, { nullable: true })
  async dinosaur(
    @Args('where', { type: () => DinosaurWhereUniqueInput })
    where: DinosaurWhereUniqueInput,
  ): Promise<Dinosaur | null> {
    return this._dinoService.dinosaur(where);
  }

  @Query(() => [Dinosaur], { nullable: true })
  async allDinosaurs(
    @Args('direction', { type: () => String, nullable: true })
    direction: 'asc' | 'desc' = 'asc',
    @Args('hasFeathers', { type: () => Boolean, nullable: true })
    hasFeathers: boolean,
  ) {
    return this._dinoService.dinosaurs({
      orderBy: { name: direction },
      where: { hasFeathers },
    });
  }

  @Mutation(() => Dinosaur) async createDino(
    @Args('dino', { type: () => DinosaurCreateInput })
    dino: Prisma.DinosaurCreateInput,
  ): Promise<Dinosaur> {
    return this._dinoService.createDinosaur(dino);
  }

  @Mutation(() => Dinosaur) async updateDino(
    @Args('where', { type: () => DinosaurWhereUniqueInput })
    where: Prisma.DinosaurWhereUniqueInput,
    @Args('data', { type: () => DinosaurUpdateInput })
    data: Prisma.DinosaurUpdateInput,
  ) {
    return this._dinoService.updateDinosaur({ where, data });
  }

  @Mutation(() => Dinosaur) async deleteDino(
    @Args('where', { type: () => DinosaurWhereUniqueInput })
    where: Prisma.DinosaurWhereUniqueInput,
  ): Promise<Dinosaur> {
    return this._dinoService.deleteDinosaur(where);
  }
}
