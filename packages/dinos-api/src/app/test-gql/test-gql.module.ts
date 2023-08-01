import { Module } from '@nestjs/common';
import { TestDinoResolver } from './resolvers/test-dino.resolver';

@Module({
  providers: [TestDinoResolver],
})
export class TestGqlModule {}
