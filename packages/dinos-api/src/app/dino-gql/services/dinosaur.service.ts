import { Injectable } from '@nestjs/common';
import { Dinosaur, Prisma } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class DinosaurService {
  constructor(private readonly _prisma: PrismaService) {}

  async dinosaur(
    dinosaurWhereUniqueInput: Prisma.DinosaurWhereUniqueInput,
  ): Promise<Dinosaur | null> {
    return this._prisma.dinosaur.findUnique({
      where: dinosaurWhereUniqueInput,
    });
  }

  async dinosaurs(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.DinosaurWhereUniqueInput;
      where?: Prisma.DinosaurWhereInput;
      orderBy?: Prisma.DinosaurOrderByWithRelationInput;
    } = {},
  ): Promise<Dinosaur[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this._prisma.dinosaur.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createDinosaur(data: Prisma.DinosaurCreateInput): Promise<Dinosaur> {
    return this._prisma.dinosaur.create({
      data,
    });
  }

  async updateDinosaur(params: {
    where: Prisma.DinosaurWhereUniqueInput;
    data: Prisma.DinosaurUpdateInput;
  }): Promise<Dinosaur> {
    const { where, data } = params;
    return this._prisma.dinosaur.update({
      data,
      where,
    });
  }

  async deleteDinosaur(
    where: Prisma.DinosaurWhereUniqueInput,
  ): Promise<Dinosaur> {
    return this._prisma.dinosaur.delete({
      where,
    });
  }
}
