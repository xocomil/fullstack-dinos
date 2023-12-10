import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: './packages/angular-dinos/dinos-gql/src/**/*.graphql',
  generates: {
    './packages/angular-dinos/dinos-gql/src/lib/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        addExplicitOverride: true,
        pureMagicComment: true,
        dedupeFragments: true,
      },
    },
  },
};
export default config;
