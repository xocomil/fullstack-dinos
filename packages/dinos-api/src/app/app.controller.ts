import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetHelloResponse } from './dtos/get-hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @ApiParam({
    name: 'name',
    required: true,
    description: 'The name of the hello',
    type: String,
  })
  @ApiOkResponse({ type: GetHelloResponse })
  @Get('/hello/:name')
  getHello(
    @Param('name')
    name = 'World',
  ): { hello: string } {
    return this.appService.getHello(name);
  }
}
