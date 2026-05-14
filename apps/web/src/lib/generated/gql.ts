/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetWorkspaceDocuments($workspaceId: String!) {\n  workspaceDocuments(workspaceId: $workspaceId) {\n    id\n    title\n    createdAt\n    updatedAt\n  }\n}\n\nmutation CreateDocument($input: CreateDocumentInput!) {\n  createDocument(createDocumentInput: $input) {\n    id\n    title\n  }\n}\n\nquery GetDocument($id: String!) {\n  document(id: $id) {\n    id\n    title\n    content\n    updatedAt\n  }\n}\n\nmutation UpdateDocument($input: UpdateDocumentInput!) {\n  updateDocument(updateDocumentInput: $input) {\n    id\n    title\n    content\n  }\n}\n\nmutation DeleteDocument($id: String!) {\n  removeDocument(id: $id) {\n    id\n  }\n}": typeof types.GetWorkspaceDocumentsDocument,
    "mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteWorkspace($id: String!) {\n  removeWorkspace(id: $id) {\n    id\n  }\n}": typeof types.CreateWorkspaceDocument,
    "query GetUserWorkspaces($userId: String!) {\n  workspaces(userId: $userId) {\n    id\n    name\n    createdAt\n  }\n}\n\nmutation InviteUser($email: String!, $workspaceId: String!) {\n  inviteUser(inviteUserInput: {email: $email, workspaceId: $workspaceId}) {\n    status\n    email\n  }\n}\n\nquery GetWorkspaceMembers($workspaceId: String!) {\n  workspaceMembers(workspaceId: $workspaceId) {\n    id\n    role\n    joinedAt\n    user {\n      id\n      name\n      email\n      avatar\n    }\n  }\n}\n\nmutation UpdateMemberRole($workspaceId: String!, $userId: String!, $role: String!) {\n  updateMemberRole(\n    updateRoleInput: {workspaceId: $workspaceId, userId: $userId, role: $role}\n  ) {\n    id\n    role\n  }\n}\n\nquery GetMyWorkspaceRole($workspaceId: String!, $userId: String!) {\n  getMyWorkspaceRole(workspaceId: $workspaceId, userId: $userId)\n}": typeof types.GetUserWorkspacesDocument,
};
const documents: Documents = {
    "query GetWorkspaceDocuments($workspaceId: String!) {\n  workspaceDocuments(workspaceId: $workspaceId) {\n    id\n    title\n    createdAt\n    updatedAt\n  }\n}\n\nmutation CreateDocument($input: CreateDocumentInput!) {\n  createDocument(createDocumentInput: $input) {\n    id\n    title\n  }\n}\n\nquery GetDocument($id: String!) {\n  document(id: $id) {\n    id\n    title\n    content\n    updatedAt\n  }\n}\n\nmutation UpdateDocument($input: UpdateDocumentInput!) {\n  updateDocument(updateDocumentInput: $input) {\n    id\n    title\n    content\n  }\n}\n\nmutation DeleteDocument($id: String!) {\n  removeDocument(id: $id) {\n    id\n  }\n}": types.GetWorkspaceDocumentsDocument,
    "mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteWorkspace($id: String!) {\n  removeWorkspace(id: $id) {\n    id\n  }\n}": types.CreateWorkspaceDocument,
    "query GetUserWorkspaces($userId: String!) {\n  workspaces(userId: $userId) {\n    id\n    name\n    createdAt\n  }\n}\n\nmutation InviteUser($email: String!, $workspaceId: String!) {\n  inviteUser(inviteUserInput: {email: $email, workspaceId: $workspaceId}) {\n    status\n    email\n  }\n}\n\nquery GetWorkspaceMembers($workspaceId: String!) {\n  workspaceMembers(workspaceId: $workspaceId) {\n    id\n    role\n    joinedAt\n    user {\n      id\n      name\n      email\n      avatar\n    }\n  }\n}\n\nmutation UpdateMemberRole($workspaceId: String!, $userId: String!, $role: String!) {\n  updateMemberRole(\n    updateRoleInput: {workspaceId: $workspaceId, userId: $userId, role: $role}\n  ) {\n    id\n    role\n  }\n}\n\nquery GetMyWorkspaceRole($workspaceId: String!, $userId: String!) {\n  getMyWorkspaceRole(workspaceId: $workspaceId, userId: $userId)\n}": types.GetUserWorkspacesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetWorkspaceDocuments($workspaceId: String!) {\n  workspaceDocuments(workspaceId: $workspaceId) {\n    id\n    title\n    createdAt\n    updatedAt\n  }\n}\n\nmutation CreateDocument($input: CreateDocumentInput!) {\n  createDocument(createDocumentInput: $input) {\n    id\n    title\n  }\n}\n\nquery GetDocument($id: String!) {\n  document(id: $id) {\n    id\n    title\n    content\n    updatedAt\n  }\n}\n\nmutation UpdateDocument($input: UpdateDocumentInput!) {\n  updateDocument(updateDocumentInput: $input) {\n    id\n    title\n    content\n  }\n}\n\nmutation DeleteDocument($id: String!) {\n  removeDocument(id: $id) {\n    id\n  }\n}"): (typeof documents)["query GetWorkspaceDocuments($workspaceId: String!) {\n  workspaceDocuments(workspaceId: $workspaceId) {\n    id\n    title\n    createdAt\n    updatedAt\n  }\n}\n\nmutation CreateDocument($input: CreateDocumentInput!) {\n  createDocument(createDocumentInput: $input) {\n    id\n    title\n  }\n}\n\nquery GetDocument($id: String!) {\n  document(id: $id) {\n    id\n    title\n    content\n    updatedAt\n  }\n}\n\nmutation UpdateDocument($input: UpdateDocumentInput!) {\n  updateDocument(updateDocumentInput: $input) {\n    id\n    title\n    content\n  }\n}\n\nmutation DeleteDocument($id: String!) {\n  removeDocument(id: $id) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteWorkspace($id: String!) {\n  removeWorkspace(id: $id) {\n    id\n  }\n}"): (typeof documents)["mutation CreateWorkspace($input: CreateWorkspaceInput!) {\n  createWorkspace(createWorkspaceInput: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteWorkspace($id: String!) {\n  removeWorkspace(id: $id) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetUserWorkspaces($userId: String!) {\n  workspaces(userId: $userId) {\n    id\n    name\n    createdAt\n  }\n}\n\nmutation InviteUser($email: String!, $workspaceId: String!) {\n  inviteUser(inviteUserInput: {email: $email, workspaceId: $workspaceId}) {\n    status\n    email\n  }\n}\n\nquery GetWorkspaceMembers($workspaceId: String!) {\n  workspaceMembers(workspaceId: $workspaceId) {\n    id\n    role\n    joinedAt\n    user {\n      id\n      name\n      email\n      avatar\n    }\n  }\n}\n\nmutation UpdateMemberRole($workspaceId: String!, $userId: String!, $role: String!) {\n  updateMemberRole(\n    updateRoleInput: {workspaceId: $workspaceId, userId: $userId, role: $role}\n  ) {\n    id\n    role\n  }\n}\n\nquery GetMyWorkspaceRole($workspaceId: String!, $userId: String!) {\n  getMyWorkspaceRole(workspaceId: $workspaceId, userId: $userId)\n}"): (typeof documents)["query GetUserWorkspaces($userId: String!) {\n  workspaces(userId: $userId) {\n    id\n    name\n    createdAt\n  }\n}\n\nmutation InviteUser($email: String!, $workspaceId: String!) {\n  inviteUser(inviteUserInput: {email: $email, workspaceId: $workspaceId}) {\n    status\n    email\n  }\n}\n\nquery GetWorkspaceMembers($workspaceId: String!) {\n  workspaceMembers(workspaceId: $workspaceId) {\n    id\n    role\n    joinedAt\n    user {\n      id\n      name\n      email\n      avatar\n    }\n  }\n}\n\nmutation UpdateMemberRole($workspaceId: String!, $userId: String!, $role: String!) {\n  updateMemberRole(\n    updateRoleInput: {workspaceId: $workspaceId, userId: $userId, role: $role}\n  ) {\n    id\n    role\n  }\n}\n\nquery GetMyWorkspaceRole($workspaceId: String!, $userId: String!) {\n  getMyWorkspaceRole(workspaceId: $workspaceId, userId: $userId)\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;