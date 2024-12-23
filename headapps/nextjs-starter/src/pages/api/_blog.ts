import { NextApiRequest, NextApiResponse } from 'next';

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || 'https://xmcloudcm.localhost/sitecore/api/authoring/graphql/v1';
const EXTERNAL_API_URL =
  process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com/posts';

// Define the type for external API posts
interface Post {
  id: number;
  title: string;
  body: string;
}

// Function to check if an individual item exists in Sitecore
async function checkItemExists(id: number): Promise<boolean> {
  const query = `
    query {
      item(path: "/sitecore/content/EspireDemo/Espire/Home/Blog/Blog-${id}", language: "en") {
        id
      }
    }
  `;

  const response = await fetch('https://xmcloudcm.localhost/sitecore/api/graph/edge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      sc_apikey: '{4BDCDFA9-4555-483C-BA72-C246EA79F02B}', // Replace with your Sitecore API key
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  console.log(`GraphQL Response for Blog-${id}:`, JSON.stringify(result, null, 2));

  // Check if the item exists (if id is not null)
  // Correctly interpret the GraphQL response
  const itemExists = result.data?.item !== null;
  console.log(`Does Blog-${id} exist?`, itemExists);
  return itemExists;
}

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Fetch external API data
    const response = await fetch(EXTERNAL_API_URL);
    const posts: Post[] = await response.json();

    // Process each post and check if it needs to be created
    for (const post of posts) {
      console.log(`Checking if Blog-${post.id} exists...`);
      const exists = await checkItemExists(post.id);

      if (exists) {
        console.log(`Blog-${post.id} already exists. Skipping creation.`);
        continue;
      }

      console.log(`Creating Blog-${post.id}...`);
      await createBlogItem(post.id, post.title, post.body);
      console.log(`Successfully created Blog-${post.id}`);
    }

    res.status(200).json({ message: 'Blog data processed successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error processing blog data:', error.message);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      console.error('Unexpected error type:', error);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: 'Unknown error occurred' });
    }
  }
}

// Function to perform the GraphQL mutation
async function createBlogItem(id: number, title: string, body: string) {
  const mutation = `
    mutation CreateItem($input: CreateItemInput!) {
      createItem(input: $input) {
        item {
          itemId
          path
        }
      }
    }
  `;

  const variables = {
    input: {
      database: 'master',
      parent: '{C5F6B06D-40C9-4021-95E7-EA3A0D25A932}', // Replace with actual parent ID
      templateId: '{857A7E55-394B-43A7-B0A9-A0FCDFDD0C09}', // Replace with actual template ID
      name: `Blog-${id}`,
      fields: [
        { name: 'Title', value: title },
        { name: 'Content', value: body },
        { name: 'ID', value: id.toString() },
      ],
      language: 'en',
    },
  };

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX0N6bzhIRGhsVlcySENISzEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJlc3BpcmUtaW5mb2xhYnMtc2luZ2Fwb3JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19kaXNwbGF5X25hbWUiOiJFc3BpcmUgSW5mb2xhYnMgU2luZ2Fwb3JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19hY2NvdW50X2lkIjoiMDAxMU4wMDAwMVV0VGJrUUFGIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ190eXBlIjoicGFydG5lciIsInNjX29yZ19yZWdpb24iOiJhdWUiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvZW1haWwiOiJtYW5vai5jaG9wa2FyQGVzcGlyZS5jb20iLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvcm9sZXMiOlsiW0dsb2JhbF1cXEV2ZXJ5b25lIiwiW09yZ2FuaXphdGlvbl1cXE9yZ2FuaXphdGlvbiBBZG1pbiJdLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvY2xpZW50X25hbWUiOiJYTSBDbG91ZCBEZXBsb3kgKENMSSkiLCJpc3MiOiJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby8iLCJzdWIiOiJhdXRoMHw2M2UzYjAyNWU5ODUxNTg2NzYwNGVjN2YiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuc2l0ZWNvcmVjbG91ZC5pbyIsImh0dHBzOi8vb25lLXNjLXByb2R1Y3Rpb24uZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTczNDk1ODI5NSwiZXhwIjoxNzM1MDQ0Njk1LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIGlhbS51c3I6ciBpYW0udXNyOncgaWFtLnVzcl9vcmdzOnIgYmFja2JvbmUuZXZlbnRzOnJlYWQgY29ubmVjdC50b2tlbnM6Y3JlYXRlIGNvbm5lY3QucG9ydGFsOnJlYWQgcGxhdGZvcm0ucmVnaW9uczpsaXN0IGlhbS5vcmc6ciBpYW0ub3JnOncgaWFtLm9yZ19jb25zOnIgaWFtLm9yZ19jb25zOncgaWFtLm9yZ19pbnZzOnIgaWFtLm9yZ19pbnZzOncgaWFtLm9yZ19tYnJzOnIgaWFtLm9yZ19tYnJzOncgaWFtLm9yZ19tYnJzX3JvbGVzOncgaWFtLnJvbGVzOnIgaWFtLnVzcl9yb2xlczpyIHhtY2xvdWRkZXBsb3kucHJvamVjdHM6bWFuYWdlIHhtY2xvdWRkZXBsb3kuZW52aXJvbm1lbnRzOm1hbmFnZSB4bWNsb3VkZGVwbG95Lm9yZ2FuaXphdGlvbnM6bWFuYWdlIHhtY2xvdWRkZXBsb3kuZGVwbG95bWVudHM6bWFuYWdlIHhtY2xvdWRkZXBsb3kubW9uaXRvcmluZy5kZXBsb3ltZW50czpyZWFkIHhtY2xvdWRkZXBsb3kuY2xpZW50czptYW5hZ2UgeG1jbG91ZGRlcGxveS5zb3VyY2Vjb250cm9sOm1hbmFnZSB4bWNsb3VkZGVwbG95LnJoOm1uZyB4bWNsb3VkZGVwbG95LnNpdGU6bW5nIHhtY2xvdWQuY206YWRtaW4geG1jbG91ZC5jbTpsb2dpbiBjb25uZWN0LndlYmhvb2tzOnJlYWQgY29ubmVjdC53ZWJob29rczpjcmVhdGUgY29ubmVjdC53ZWJob29rczp1cGRhdGUgY29ubmVjdC53ZWJob29rczpkZWxldGUgcGxhdGZvcm0udGVuYW50czpsaXN0YWxsIGJhY2tib25lLmV2ZW50czplbmFibGUgYmFja2JvbmUuZXZlbnRzOmRpc2FibGUgdWkuZXh0ZW5zaW9uczpyZWFkIGVkZ2UudG9rZW5zOmNyZWF0ZSBlZGdlLnRva2VuczpyZWFkIGVkZ2UudG9rZW5zOmRlbGV0ZSBlZGdlLnRva2Vuczp1cGRhdGUgaGMubWdtbnQudHlwZXM6d3JpdGUgaGMubWdtbnQuYXBpa2V5czptYW5hZ2UgaGMubWdtbnQudHlwZXM6cmVhZCBoYy5tZ21udC5tZWRpYTptYW5hZ2UgaGMubWdtbnQuc3RhdGVzOnB1Ymxpc2ggaGMubWdtbnQuaXRlbXM6bWFuYWdlIGhjLm1nbW50LnVzZXJzOnJlYWQgaGMubWdtbnQuY2xpZW50czpyZWFkIGhjLm1nbW50LnRheG9ub21pZXM6cmVhZCBoYy5tZ21udC50YXhvbm9taWVzOndyaXRlIGhjLm1nbW50LmxvY2FsZXM6ciBoYy5tZ21udC5sb2NhbGVzOncgaGMubWdtbnQuc2V0dGluZ3M6ciBoYy5tZ21udC5zZXR0aW5nczptIG1tcy51cGxvYWQuZmlsZTphZGQgbW1zLnVwbG9hZC5maWxlOnJlbW92ZSBjbXAuc2l0ZXM6Y3JlYXRlIGNtcC5zaXRlczpyZWFkIGNtcC5jb2xsZWN0aW9uczpjcmVhdGUgY21wLmNvbGxlY3Rpb25zOnJlYWQgY21wLmNvbGxlY3Rpb25zOmRlbGV0ZSBjbXAuY29tcG9uZW50czpjcmVhdGUgY21wLmNvbXBvbmVudHM6cmVhZCBjbXAuY29tcG9uZW50czpkZWxldGUgY21wLmRhdGFzb3VyY2VzOmNyZWF0ZSBjbXAuZGF0YXNvdXJjZXM6cmVhZCBjbXAuZGF0YXNvdXJjZXM6ZGVsZXRlIGNtcC5zdHlsZXM6cmVhZCBjbXAuc3R5bGVzOnVwZGF0ZSBjbXAuc3R5bGVzOmRlbGV0ZSBjbXAucHJveHk6cmVhZCBjbXAuYmxvYnM6Y3JlYXRlIHN1cHBvcnQudGlja2V0czpjcmVhdGUgc2VhcmNoLnBvcnRhbDptYW5hZ2Ugc2VhcmNoLmRpc2NvdmVyOm1hbmFnZSBzZWFyY2guYWRtaW46bWFuYWdlIHNlYXJjaC5pbnRlcm5hbDptYW5hZ2Ugc2VhcmNoLnV0aWw6bWFuYWdlIHNlYXJjaC5hY2NvdW50Om1hbmFnZSBkaXNjb3Zlci5wb3J0YWw6bWFuYWdlIGRpc2NvdmVyLnNlYXJjaC1yZWM6bWFuYWdlIGRpc2NvdmVyLmFkbWluOm1hbmFnZSBkaXNjb3Zlci5pbnRlcm5hbDptYW5hZ2UgZGlzY292ZXIudXRpbDptYW5hZ2UgZGlzY292ZXIuZXZlbnQ6bWFuYWdlIGRpc2NvdmVyLmFjY291bnQ6bWFuYWdlIGZvcm1zLmVuZHBvaW50czpyZWFkIGZvcm1zLmVuZHBvaW50czpjcmVhdGUgZm9ybXMuZW5kcG9pbnRzOnVwZGF0ZSBmb3Jtcy5lbmRwb2ludHM6ZGVsZXRlIGZvcm1zLnN1Ym1pc3Npb25zOnJlYWQgZm9ybXMuc3VibWlzc2lvbnM6Y3JlYXRlIGZvcm1zLnN1Ym1pc3Npb25zOnVwZGF0ZSBmb3Jtcy5zdWJtaXNzaW9uczpkZWxldGUgZm9ybXMuZXhwb3J0czpjcmVhdGUgZm9ybXMuZXhwb3J0czpyZWFkIGF1ZGl0LmxvZ3M6ciBjb25uZWN0Lm9yZzpyIGNvbm5lY3Qub3JnLnRudDpyIGNvbm5lY3QucmNwOmMgY29ubmVjdC5yY3A6ciBjb25uZWN0LnJjcDp1IGNvbm5lY3QucmNwOmQgY29ubmVjdC5jb246YyBjb25uZWN0LmNvbjpyIGNvbm5lY3QuY29uOnUgY29ubmVjdC5jb246ZCBjb25uZWN0LmZsZHI6YyBjb25uZWN0LmZsZHI6ciBjb25uZWN0LmZsZHI6ZCBjb25uZWN0LmxjbC5pbXA6YyBjb25uZWN0LmxjbC5pbXA6ciBjb25uZWN0LmxjbC5leHA6YyBjb25uZWN0LmxjbC5leHA6ciBjb25uZWN0LnByb2o6ciBjb25uZWN0LnByb2o6ZCBlcC5hZG1uLm9yZ3MuaHN0bm1lOnIgZXAuYWRtbi5vcmdzLmhzdG5tZTp3IGVwLnVzci5jdHg6ciBlcC51c3IuY3R4OncgZXAudXNyLmN0eF9yZXM6ciBlcC51c3IuY3R4X3Jlczp3IHhtYXBwcy5jb250ZW50OmdlbiBhaS5vcmcuYnJkOmwgYWkub3JnLmJyZDpyIGFpLm9yZy5icmQ6dyBhaS5vcmcuZWc6ciBhaS5vcmcuZWc6dyBhaS5vcmcuY2h0czpyIGFpLm9yZy5jaHRzOncgYWkub3JnLmRvY3M6ciBhaS5vcmcuZG9jczp3IGFpLm9yZy5icmk6ciBhaS5vcmcuYnJpOncgYWkuZ2VuLmNtcDpyIGFpLmdlbi5jbXA6dyBhaS5yZWMudmFyOncgYWkucmVjLnZhcjpyIGFpLnJlYy5oeXA6dyBhaS5yZWMuaHlwOnIgYWkub3JnOmFkbWluIGFpLm9yZzp1c2VyIG1tcy5kZWxpdmVyeTpyIGNzLmFsbDplZGl0b3IgY3MuYWxsOmFkbWluIHhtY3B1Yi5xdWV1ZTpyIHhtY3B1Yi5qb2JzLmE6dyB4bWNwdWIuam9icy5hOnIgbWtwLmFwcHM6ciBta3AuYXBwczp3IG1rcC5jbGllbnRzOnIgbWtwLmNsaWVudHM6dyBta3AuYXBwaW5zdGxzOnIgbWtwLmFwcGluc3Rsczp3IiwiYXpwIjoiQ2hpOEV3ZkZuRWVqa3NrM1NlZDlobGFsR2lNOUIydjcifQ.JpfI060gqeceSMPZRQtn_lecycXFKuNnjMBW-qpkAECpYcBZYA3900WTkXbTNLasXAE-2ScS5-aKJ3l75igYmfUB8SbQSyOv1aRiUjzIFqULmSst0LpTGcO6HRH9pYsG7QOz7IdSkEJQZGBMVtzaUqnElZVtdWoqCgYzMww9M5TezhFMuFF2ROOUM20fwIfTmxaqUq0aOrSmicto9GiSLp2sr-0FktimCckeHgphEikOBHu3kDIKvyNsGXexlfkLk7CPqxnWaxDJWoxOWKEtJwqGrkpCJu9l9l8a0onYzgXu0jZs8j5m-iY6N0SM8tuH81Sbx4ZHE2oVm5SKTW9NhA',
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const result = await response.json();
  console.log(`GraphQL Mutation Result for Blog-${id}:`, JSON.stringify(result, null, 2));

  if (!result.data?.createItem?.item) {
    throw new Error(`Failed to create Blog-${id}: ${JSON.stringify(result.errors)}`);
  }
}
