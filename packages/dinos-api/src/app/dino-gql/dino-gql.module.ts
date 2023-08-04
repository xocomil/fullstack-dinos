import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { DinosaurResolver } from './resolvers/dinosaur.resolver';
import { DinosaurService } from './services/dinosaur.service';

@Module({
  providers: [DinosaurResolver, DinosaurService, PrismaService],
})
export class DinoGqlModule {}
