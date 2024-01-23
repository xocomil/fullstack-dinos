import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { DinoDto } from './dtos/dino.dto';

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

  async openai(dino: DinoDto): Promise<DinoDto> {
    const client = new OpenAI();
    const thread = await client.beta.threads.create();

    const messages = await client.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: '{name: "Triceratops", heightInMeters: 0, weightInKilograms: 0}',
    });

    const assistant = await client.beta.assistants.retrieve(
      'asst_RovL6yql82hz7dzA71qlNnad',
    );

    let resp = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    while (resp.status !== 'completed') {
      console.log('resp', resp);

      await (async () => new Promise((resolve) => setTimeout(resolve, 1000)))();

      resp = await client.beta.threads.runs.retrieve(thread.id, resp.id);
    }

    const aiMessages = await client.beta.threads.messages.list(thread.id);

    console.log('assistant', aiMessages);

    const content = aiMessages.data[0].content[0];

    if (content.type === 'text') {
      const json = content.text.value;

      return JSON.parse(json);
    }

    throw new Error('Response was not JSON');
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
