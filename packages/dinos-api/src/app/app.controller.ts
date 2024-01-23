import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Sse,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs';
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
  ): GetHelloResponse {
    return this.appService.getHello(name);
  }

  @ApiOkResponse({ type: GetHelloResponse })
  @Get('helloQuery')
  getHelloQuery(
    @Query('name') name: string,
    @Query(
      'age',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.I_AM_A_TEAPOT,
      }),
    )
    age: number,
  ): GetHelloResponse {
    return this.appService.getHelloWithAge(name, age);
  }

  @Sse('openai')
  async openai(@Body() dino: unknown): Promise<Observable<unknown>> {
    return await this.appService.openai(dino);
  }
}
