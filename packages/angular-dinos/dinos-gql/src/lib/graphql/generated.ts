import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Dinosaur = {
  __typename?: 'Dinosaur';
  description?: Maybe<Scalars['String']['output']>;
  genus: Scalars['String']['output'];
  hasFeathers: Scalars['Boolean']['output'];
  heightInMeters: Scalars['Float']['output'];
  id?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  species: Scalars['String']['output'];
  trivia?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  weightInKilos: Scalars['Float']['output'];
};

export type DinosaurCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  genus: Scalars['String']['input'];
  hasFeathers: Scalars['Boolean']['input'];
  heightInMeters: Scalars['Float']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  species: Scalars['String']['input'];
  trivia?: InputMaybe<Array<Scalars['String']['input']>>;
  weightInKilos: Scalars['Float']['input'];
};

export type DinosaurUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  hasFeathers?: InputMaybe<Scalars['Boolean']['input']>;
  heightInMeters?: InputMaybe<Scalars['Float']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  trivia?: InputMaybe<Array<Scalars['String']['input']>>;
  weightInKilos?: InputMaybe<Scalars['Float']['input']>;
};

export type DinosaurWhereUniqueInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDino: Dinosaur;
  deleteDino: Dinosaur;
  updateDino: Dinosaur;
  updateTestDino: TestDino;
};


export type MutationCreateDinoArgs = {
  dino: DinosaurCreateInput;
};


export type MutationDeleteDinoArgs = {
  where: DinosaurWhereUniqueInput;
};


export type MutationUpdateDinoArgs = {
  data: DinosaurUpdateInput;
  where: DinosaurWhereUniqueInput;
};


export type MutationUpdateTestDinoArgs = {
  updateDinoInput: UpdateDinoInput;
};

export type Query = {
  __typename?: 'Query';
  allDinosaurs?: Maybe<Array<Dinosaur>>;
  dinosaur?: Maybe<Dinosaur>;
  testDino: TestDino;
};


export type QueryAllDinosaursArgs = {
  direction?: InputMaybe<Scalars['String']['input']>;
  hasFeathers?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryDinosaurArgs = {
  where: DinosaurWhereUniqueInput;
};


export type QueryTestDinoArgs = {
  hasFeathers?: InputMaybe<Scalars['Boolean']['input']>;
};

/** This represents a Dinosaur */
export type TestDino = {
  __typename?: 'TestDino';
  /** Does it have feathers? */
  hasFeathers: Scalars['Boolean']['output'];
  /** This represents the id of the Dinosaur */
  id?: Maybe<Scalars['ID']['output']>;
  /** This represents the name of the Dinosaur */
  name: Scalars['String']['output'];
};

export type UpdateDinoInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type DinoDetailsFragment = { __typename?: 'Dinosaur', id?: string | null, name: string, genus: string, species: string, description?: string | null, hasFeathers: boolean, heightInMeters: number, weightInKilos: number, imageUrl?: string | null, trivia?: Array<string> | null, updatedAt?: any | null };

export type AllDinosaursQueryVariables = Exact<{
  direction?: InputMaybe<Scalars['String']['input']>;
  hasFeathers?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AllDinosaursQuery = { __typename?: 'Query', allDinosaurs?: Array<{ __typename?: 'Dinosaur', id?: string | null, name: string, genus: string, species: string, hasFeathers: boolean, description?: string | null }> | null };

export type DinoQueryVariables = Exact<{
  where: DinosaurWhereUniqueInput;
}>;


export type DinoQuery = { __typename?: 'Query', dinosaur?: { __typename?: 'Dinosaur', id?: string | null, name: string, genus: string, species: string, description?: string | null, hasFeathers: boolean, heightInMeters: number, weightInKilos: number, imageUrl?: string | null, trivia?: Array<string> | null, updatedAt?: any | null } | null };

export type CreateDinoMutationVariables = Exact<{
  dino: DinosaurCreateInput;
}>;


export type CreateDinoMutation = { __typename?: 'Mutation', createDino: { __typename?: 'Dinosaur', id?: string | null, name: string, genus: string, species: string, description?: string | null, hasFeathers: boolean, heightInMeters: number, weightInKilos: number, imageUrl?: string | null, trivia?: Array<string> | null, updatedAt?: any | null } };

export const DinoDetailsFragmentDoc = gql`
    fragment DinoDetails on Dinosaur {
  id
  name
  genus
  species
  description
  hasFeathers
  heightInMeters
  weightInKilos
  imageUrl
  trivia
  updatedAt
}
    `;
export const AllDinosaursDocument = gql`
    query AllDinosaurs($direction: String, $hasFeathers: Boolean) {
  allDinosaurs(direction: $direction, hasFeathers: $hasFeathers) {
    id
    name
    genus
    species
    hasFeathers
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AllDinosaursGQL extends Apollo.Query<AllDinosaursQuery, AllDinosaursQueryVariables> {
    document = AllDinosaursDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DinoDocument = gql`
    query Dino($where: DinosaurWhereUniqueInput!) {
  dinosaur(where: $where) {
    ...DinoDetails
  }
}
    ${DinoDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DinoGQL extends Apollo.Query<DinoQuery, DinoQueryVariables> {
    document = DinoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateDinoDocument = gql`
    mutation CreateDino($dino: DinosaurCreateInput!) {
  createDino(dino: $dino) {
    ...DinoDetails
  }
}
    ${DinoDetailsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateDinoGQL extends Apollo.Mutation<CreateDinoMutation, CreateDinoMutationVariables> {
    document = CreateDinoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }