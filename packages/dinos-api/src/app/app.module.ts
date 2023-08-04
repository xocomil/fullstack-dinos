import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DinoGqlModule } from './dino-gql/dino-gql.module';
import { PrismaService } from './services/prisma.service';
import { TestGqlModule } from './test-gql/test-gql.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TestGqlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      include: [DinoGqlModule, TestGqlModule],
      installSubscriptionHandlers: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      sortSchema: true,
      // transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
    }),
    DinoGqlModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
