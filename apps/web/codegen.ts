import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// Force the generator to read the .env file
dotenv.config(); 

const config: CodegenConfig = {
  schema: '../api/src/schema.gql',
  
  documents: ['src/**/*.graphql'],
  
  generates: {
    './src/lib/generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      }
    },
  },
  ignoreNoDocuments: true,
};

export default config;