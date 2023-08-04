import { Test, TestingModule } from '@nestjs/testing';
import { DinosaurService } from './dinosaur.service';

describe('DinosaurService', () => {
  let service: DinosaurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinosaurService],
    }).compile();

    service = module.get<DinosaurService>(DinosaurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
