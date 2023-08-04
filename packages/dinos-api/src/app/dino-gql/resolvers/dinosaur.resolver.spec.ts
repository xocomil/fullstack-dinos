import { Test, TestingModule } from '@nestjs/testing';
import { DinosaurResolver } from './dinosaur.resolver';

describe('DinosaurResolver', () => {
  let resolver: DinosaurResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinosaurResolver],
    }).compile();

    resolver = module.get<DinosaurResolver>(DinosaurResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
