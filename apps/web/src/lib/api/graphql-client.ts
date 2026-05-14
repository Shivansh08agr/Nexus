export async function fetchGraphQL<T>(query: string, variables = {}): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_GRAPHQL_URL is not defined in the environment.");
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error('GraphQL Errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('Failed to fetch GraphQL API');
  }

  return json.data;
}