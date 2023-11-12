# FullstackDinos

A demo library that shows how to build an application using [Nx](https://nx.dev/getting-started/intro), [NestJS](https://docs.nestjs.com/), [Angular](https://angular.dev/), [Apollo Angular](https://the-guild.dev/graphql/apollo-angular/docs), [@ngrx/component-store](https://ngrx.io/guide/component-store) and [@ngrx/signals]().

The application is a simple backend server running on NestJS using Prisma. The frontend is built using Angular 17, [Tailwind CSS](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/components/). It is a simple CRUD application showing how to use Apollo with the different component level state management from NgRx.

## How To Set Up FullStack Dinos

1. FullStack Dinos relies on a database for persistence. In the stream we use [PostgreSQL](https://www.postgresql.org/download/), you will need to have a database ready before you begin.
2. Clone the repo: `git clone https://github.com/xocomil/fullstack-dinos.git`
3. Follow the [documentation from Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql) for creating a `.env` file. An example can be found below.
4. You will need to edit the `prisma/schema.prisma` file to set up your db connection. You need to change the `provider` in the `datasource db` object to use your database. Example below.
5. Run `prisma migrate`
   - **npm:** `npx prisma migrate dev`
   - **yarn:** `yarn prisma migrate dev`
   - **pnpm:** `pnpx prisma migrate dev`
6. Start the api server
   - **npm:** `npx nx s dinos-api`
   - **yarn:** `yarn nx s dinos-api`
   - **pnpm:** `pnpx nx s dinos-api`
7. Start the angular dev server
   - **npm:** `npx nx s angular-dinos`
   - **yarn:** `yarn nx s angular-dinos`
   - **pnpm:** `pnpx nx s angular-dinos`

#### Example `.env` File

```dotenv
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

#### Example `prisma/schema.prisma` File

```prisma
datasource db {
provider = "postgresql"    // You should only change this line
url      = env("DATABASE_URL")
}
```
