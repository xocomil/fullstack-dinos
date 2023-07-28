import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getHello(name: string): { hello: string } {
    return { hello: `Hello ${name}!` };
  }
}
