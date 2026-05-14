import { fetchGraphQL } from './graphql-client';

export async function syncUserWithDatabase(email: string, name: string, googleId: string, avatar?: string | null) {
  const mutation = `
    mutation SyncUser($email: String!, $name: String!, $googleId: String!, $avatar: String) {
      syncUser(email: $email, name: $name, googleId: $googleId, avatar: $avatar) {
        id
      }
    }
  `;

  const variables = { email, name, googleId, avatar };

  return fetchGraphQL(mutation, variables);
}