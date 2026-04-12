# FullstackDinos

A demo application that shows how to build a fullstack project using [Nx](https://nx.dev/getting-started/intro), [NestJS](https://docs.nestjs.com/), [Angular](https://angular.dev/), [Apollo Angular](https://the-guild.dev/graphql/apollo-angular/docs), [@ngrx/signals](https://ngrx.io/guide/signals), and [@angular-architects/ngrx-toolkit](https://github.com/angular-architects/ngrx-toolkit).

The application is a simple CRUD app for managing dinosaur data. The backend runs on NestJS with PostgreSQL via Prisma. The frontend is built with Angular 21, [Tailwind CSS v4](https://tailwindcss.com/), and [daisyUI v5](https://daisyui.com/components/). It demonstrates signal-based state management using `@ngrx/signals` with composable store features.

## Tech Stack

| Layer         | Technology                                                              |
| ------------- | ----------------------------------------------------------------------- |
| Monorepo      | [Nx](https://nx.dev/) 22                                                |
| Backend       | [NestJS](https://docs.nestjs.com/) with [GraphQL](https://graphql.org/) |
| Frontend      | [Angular](https://angular.dev/) 21                                      |
| Styling       | [Tailwind CSS](https://tailwindcss.com/) v4 + [daisyUI](https://daisyui.com/) v5 |
| Database      | [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/) |
| State Mgmt    | [@ngrx/signals](https://ngrx.io/guide/signals) + [ngrx-toolkit](https://github.com/angular-architects/ngrx-toolkit) |
| GraphQL Client| [Apollo Angular](https://the-guild.dev/graphql/apollo-angular/docs)     |
| Package Mgr   | [pnpm](https://pnpm.io/)                                               |
| Node          | 24.13.0 (managed via [Volta](https://volta.sh/))                       |

## How To Set Up FullStack Dinos

1. FullStack Dinos relies on a database for persistence. We use [PostgreSQL](https://www.postgresql.org/download/) — you will need to have a database ready before you begin.
2. Clone the repo: `git clone https://github.com/xocomil/fullstack-dinos.git`
3. Install dependencies:
   ```sh
   pnpm install
   ```
4. Follow the [documentation from Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql) for creating a `.env` file. An example can be found below.
5. You will need to edit the `prisma/schema.prisma` file to set up your db connection. You need to change the `provider` in the `datasource db` object to use your database. Example below.
6. Run Prisma migrations:
   ```sh
   pnpm prisma migrate dev
   ```
7. Start the API server:
   ```sh
   pnpm nx serve dinos-api
   ```
8. Start the Angular dev server:
   ```sh
   pnpm nx serve angular-dinos
   ```

### Example `.env` File

```dotenv
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

### Example `prisma/schema.prisma` File

```prisma
datasource db {
  provider = "postgresql"    // You should only change this line
  url      = env("DATABASE_URL")
}
```

## Project Structure

```
packages/
├── angular-dinos/          # Angular 21 frontend application
│   ├── src/                # App entry point and root config
│   ├── dino-ui/            # Main UI components (home, table, forms, modals)
│   ├── dinos-gql/          # GraphQL client, queries, and state management
│   ├── ui-components/      # Shared UI components
│   ├── rxjs-operators/     # Custom RxJS utilities
│   └── openai/             # OpenAI integration
├── angular-dinos-e2e/      # Cypress E2E tests for frontend
├── dinos-api/              # NestJS backend API
└── dinos-api-e2e/          # Cypress E2E tests for backend
```

## State Management

This project uses **`@ngrx/signals`** exclusively for state management, with composable store features powered by `@angular-architects/ngrx-toolkit`:

- **`DinosCrudStore`** — Signal store for the main table view (sorting, filtering, CRUD operations via `withMutations` / `rxMutation`)
- **`EditDinoStore`** / **`AddDinoStore`** — Signal stores for add/edit forms, composed with reusable features (`withCallState`, `withErrors`, `withAddDino`, `withEditDino`)

## Useful Commands

| Task                    | Command                         |
| ----------------------- | ------------------------------- |
| Serve backend           | `pnpm nx serve dinos-api`       |
| Serve frontend          | `pnpm nx serve angular-dinos`   |
| Build a project         | `pnpm nx build <project-name>`  |
| Run tests               | `pnpm nx test <project-name>`   |
| Lint a project          | `pnpm nx lint <project-name>`   |
| Run all tests           | `pnpm nx run-many -t test`      |
| GraphQL codegen         | `pnpm gql`                      |
| Prisma Studio           | `pnpm prisma studio`            |
| Dependency graph        | `pnpm nx graph`                 |

> **Note:** The GraphQL codegen command requires the API server to be running, as it reads the schema from `http://localhost:3000/graphql`.

## Git Multi Contributor Counter

Number of multi-repo contributors: 3