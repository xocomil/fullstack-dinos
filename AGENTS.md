# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FullStack Dinos is a monorepo demonstrating fullstack development using Nx, NestJS (backend), Angular 17 (frontend), GraphQL (Apollo), and different NgRx state management patterns. The application is a CRUD app for managing dinosaur data with a PostgreSQL database via Prisma.

## Architecture

### Monorepo Structure
- **Nx Workspace**: Uses Nx 17.2.8 with packages stored in `packages/` directory
- **Backend**: NestJS application (`dinos-api`)
- **Frontend**: Angular 17 application (`angular-dinos`) with multiple library packages
- **E2E Tests**: Cypress tests for both apps (`angular-dinos-e2e`, `dinos-api-e2e`)

### Backend (dinos-api)
- **Technology**: NestJS with GraphQL (Apollo Server)
- **Database**: PostgreSQL via Prisma ORM
- **Schema Location**: `prisma/schema.prisma`
- **Main Entry**: `packages/dinos-api/src/main.ts`
- **Port**: 3000 (default)
- **Endpoints**:
  - GraphQL: `http://localhost:3000/graphql`
  - Swagger: `http://localhost:3000/swagger`
  - REST API: `http://localhost:3000/api`

**Module Organization**:
- `dino-gql/`: GraphQL resolvers and services for dinosaur CRUD
  - `resolvers/dinosaur.resolver.ts`: GraphQL queries/mutations
  - `services/dinosaur.service.ts`: Business logic layer
- `services/prisma.service.ts`: Prisma client wrapper
- `dtos/`: Data transfer objects

### Frontend (angular-dinos)
- **Technology**: Angular 17 standalone components with Tailwind CSS + daisyUI
- **Port**: 4200 (default via proxy)
- **State Management**: Demonstrates TWO different NgRx patterns:
  1. **@ngrx/component-store**: Used in `DinosCrudStoreService` for the main table view
  2. **@ngrx/signals**: Used in `details.store.ts` for add/edit forms via `signalStore`
- **GraphQL**: Apollo Angular client with code generation
- **Proxy**: API calls proxied to backend via `proxy.conf.json`

**Package Organization**:
- `dino-ui/`: Main UI components library (home, table, forms, modals)
- `dinos-gql/`: GraphQL client, queries, and state management
  - `dinos-crud.store.service.ts`: ComponentStore for table data
  - `store/details.store.ts`: Signal stores for add/edit forms
  - `dinos-crud.service.ts`: Apollo GraphQL service
- `ui-components/`: Shared UI components
- `rxjs-operators/`: Custom RxJS utilities
- `openai/`: OpenAI integration

### State Management Patterns
This codebase intentionally demonstrates different NgRx approaches:
- **ComponentStore**: For component-scoped reactive state (table filtering, sorting)
- **Signal Store**: For modern signal-based state with composable features (`withState`, `withCallState`, `withErrors`, `withAddDino`, `withEditDino`)

## Common Development Tasks

### Initial Setup
1. Ensure PostgreSQL is installed and running
2. Create `.env` file with `DATABASE_URL` (see README.md for format)
3. Configure `prisma/schema.prisma` provider to match your database
4. Run database migrations: `npx prisma migrate dev` (or `yarn prisma migrate dev`)

### Development Servers
- **Backend**: `npx nx serve dinos-api` or `yarn nx s dinos-api`
- **Frontend**: `npx nx serve angular-dinos` or `yarn nx s angular-dinos`
  - Also available via npm script: `npm run start-frontend`

### Building
- **Single project**: `npx nx build <project-name>`
- **All projects**: `npx nx run-many -t build`
- **Production build**: `npx nx build <project-name> -c production`

### Testing
- **Single project**: `npx nx test <project-name>`
- **All projects**: `npx nx run-many -t test`
- **With coverage**: `npx nx test <project-name> -c ci` (sets `ci: true` and `codeCoverage: true`)
- **E2E tests**: `npx nx e2e <project-name>-e2e`
- **Framework**: Jest with jest-preset-angular for Angular, standard Jest for NestJS
- **Angular testing**: Uses @ngneat/spectator and ng-mocks

### Linting
- **Single project**: `npx nx lint <project-name>`
- **All projects**: `npx nx run-many -t lint`
- **ESLint config**: `.eslintrc.json` (enforces @ngrx/component-store-strict rules)
- **Prettier config**: `.prettierrc` (singleQuote, htmlWhitespaceSensitivity)

### GraphQL Code Generation
- **Command**: `npm run gql` or `yarn gql`
- **What it does**: Generates TypeScript types and Apollo Angular services from `.graphql` files
- **Config**: `packages/angular-dinos/dinos-gql/codegen.ts`
- **Source**: Reads schema from `http://localhost:3000/graphql` (API must be running)
- **Input**: `packages/angular-dinos/dinos-gql/src/**/*.graphql`
- **Output**: `packages/angular-dinos/dinos-gql/src/lib/graphql/generated.ts`
- **IMPORTANT**: Run this after changing GraphQL queries or when backend schema changes

### Database Operations
- **Migrate**: `npx prisma migrate dev` - Create and apply migrations
- **Reset**: `npx prisma migrate reset` - Reset database and apply all migrations
- **Studio**: `npx prisma studio` - Open Prisma Studio GUI
- **Generate Client**: `npx prisma generate` - Regenerate Prisma client (auto-run on migrate)

### Nx Workspace Commands
- **Show projects**: `npx nx show projects`
- **Show project details**: `npx nx show project <project-name>`
- **Affected projects**: `npx nx affected -t build` (or test/lint)
- **Dependency graph**: `npx nx graph`

## Important Notes

### Package Manager
- **Primary**: Yarn 1.22.21 (configured via Volta)
- **Node**: 20.10.0 (configured via Volta)
- Yarn lockfile is present; prefer `yarn` commands over `npm`

### Code Style
- **Naming Conventions**:
  - Private fields use `#` prefix (modern TypeScript): `#crudService`, `#router`
  - Underscore prefix for injected services: `_prisma`, `_dinoService`
- **Components**: Standalone components only (no NgModule)
- **Prefix**: Angular components use `dino` or `fullstack-dinos` prefix
- **Imports**: Uses TypeScript path aliases from `tsconfig.base.json` (e.g., `@fullstack-dinos/angular-dinos/dinos-gql`)

### GraphQL Schema
The Dinosaur model includes:
- `id`, `name` (unique), `genus`, `species`
- `description`, `hasFeathers`, `weightInKilos`, `heightInMeters`
- `imageUrl`, `trivia` (string array), `updatedAt`

### Component Store vs Signal Store
When modifying state management:
- Use ComponentStore for reactive, effect-based state with RxJS operators
- Use Signal Store for modern signal-based state with composable features
- The codebase shows both patterns intentionally for educational purposes

### Dependency Constraints
- Nx enforces module boundaries via `@nx/enforce-module-boundaries` rule
- Build dependencies are tracked; changes cascade through affected projects
