import { Test, TestingModule } from '@nestjs/testing';
import { TestDinoResolver } from './test-dino.resolver';

describe('TestDinoResolver', () => {
  let resolver: TestDinoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestDinoResolver],
    }).compile();

    resolver = module.get<TestDinoResolver>(TestDinoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
