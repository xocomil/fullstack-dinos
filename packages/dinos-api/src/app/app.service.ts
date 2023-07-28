import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getHello(name: string): { hello: string } {
    return { hello: `Hello ${name}!` };
  }

  getHelloWithAge(name: string, age: number): { hello: string } {
    const extraGreeting = getExtraGreeting(age);

    return { hello: `Hello ${name}! ${extraGreeting}` };
  }
}

const getExtraGreeting = (age: number): string => {
  if (age <= 18) {
    return 'Welcome to the world!';
  }

  if (age > 18 && age <= 65) {
    return 'Welcome back voter!';
  }

  if (age > 65) {
    return 'Welcome back old person!';
  }
};
