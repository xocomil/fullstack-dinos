import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { DinosCrudService } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApolloModule),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:4200/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
    DinosCrudService,
    provideHttpClient(),
  ],
};
