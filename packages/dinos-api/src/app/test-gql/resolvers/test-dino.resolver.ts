import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TestDinoArgs } from '../models/test-dino.args';
import { TestDino } from '../models/test-dino.model';
import { UpdateDinoInput } from '../models/update-dino.input';

@Resolver(() => TestDino)
export class TestDinoResolver {
  @Query(() => TestDino, { name: 'testDino' })
  async getTestDino(@Args() testDinoArgs: TestDinoArgs): Promise<TestDino> {
    return Promise.resolve({
      id: '1',
      name: 'T-Rex',
      hasFeathers: testDinoArgs.hasFeathers ?? false,
    });
  }

  @Mutation(() => TestDino)
  updateTestDino(@Args('updateDinoInput') updateDinoInput: UpdateDinoInput) {
    return Promise.resolve({
      id: updateDinoInput.id,
      name: updateDinoInput.name,
      hasFeathers: true,
    });
  }
}
