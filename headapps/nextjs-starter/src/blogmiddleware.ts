import { NextRequest, NextResponse } from 'next/server';

const GRAPHQL_ENDPOINT = 'https://xmcloudcm.localhost/sitecore/api/authoring/graphql/v1';
const EXTERNAL_API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your API

// In-memory cache to store processed API IDs
const cache: Record<string, boolean> = {};

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/Blog') {
    // Background data fetching and processing
    fetchAndProcessBlogData();

    // Redirect user to Blog UI page
    return NextResponse.rewrite(new URL('/Blog', req.url));
  }
  return NextResponse.next();
}

// Background function to fetch API data and perform GraphQL mutation
async function fetchAndProcessBlogData() {
  try {
    const response = await fetch(EXTERNAL_API_URL);
    const posts = await response.json();

    for (const post of posts) {
      const uniqueId = post.id.toString();

      if (cache[uniqueId]) continue; // Skip if already processed

      // GraphQL Mutation
      await createBlogItem(post.id, post.title, post.body);
      cache[uniqueId] = true; // Add to cache
    }
  } catch (error) {
    console.error('Error during background processing:', error);
  }
}

// GraphQL Mutation function
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
      parent: '{C5F6B06D-40C9-4021-95E7-EA3A0D25A932}',
      templateId: '{857A7E55-394B-43A7-B0A9-A0FCDFDD0C09}',
      name: `Blog-${id}`,
      fields: [
        { name: 'Title', value: title },
        { name: 'Content', value: body },
        { name: 'ID', value: id.toString() },
      ],
      language: 'en',
    },
  };

  await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InpnbnhyQk9IaXJ0WXp4dnl1WVhNZyJ9.eyJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX2lkIjoib3JnX0N6bzhIRGhsVlcySENISzEiLCJodHRwczovL2F1dGguc2l0ZWNvcmVjbG91ZC5pby9jbGFpbXMvb3JnX25hbWUiOiJlc3BpcmUtaW5mb2xhYnMtc2luZ2Fwb3JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19kaXNwbGF5X25hbWUiOiJFc3BpcmUgSW5mb2xhYnMgU2luZ2Fwb3JlIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ19hY2NvdW50X2lkIjoiMDAxMU4wMDAwMVV0VGJrUUFGIiwiaHR0cHM6Ly9hdXRoLnNpdGVjb3JlY2xvdWQuaW8vY2xhaW1zL29yZ190eXBlIjoicGFydG5lciIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9lbWFpbCI6Im1hbm9qLmNob3BrYXJAZXNwaXJlLmNvbSIsImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9yb2xlcyI6WyJbR2xvYmFsXVxcRXZlcnlvbmUiLCJbT3JnYW5pemF0aW9uXVxcT3JnYW5pemF0aW9uIEFkbWluIl0sImh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvL2NsYWltcy9jbGllbnRfbmFtZSI6IlhNIENsb3VkIERlcGxveSAoQ0xJKSIsImlzcyI6Imh0dHBzOi8vYXV0aC5zaXRlY29yZWNsb3VkLmlvLyIsInN1YiI6ImF1dGgwfDYzZTNiMDI1ZTk4NTE1ODY3NjA0ZWM3ZiIsImF1ZCI6WyJodHRwczovL2FwaS5zaXRlY29yZWNsb3VkLmlvIiwiaHR0cHM6Ly9vbmUtc2MtcHJvZHVjdGlvbi5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzM0NTIwNDYzLCJleHAiOjE3MzQ2MDY4NjMsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUgb2ZmbGluZV9hY2Nlc3MgaWFtLnVzcjpyIGlhbS51c3I6dyBpYW0udXNyX29yZ3M6ciBiYWNrYm9uZS5ldmVudHM6cmVhZCBjb25uZWN0LnRva2VuczpjcmVhdGUgY29ubmVjdC5wb3J0YWw6cmVhZCBwbGF0Zm9ybS5yZWdpb25zOmxpc3QgaWFtLm9yZzpyIGlhbS5vcmc6dyBpYW0ub3JnX2NvbnM6ciBpYW0ub3JnX2NvbnM6dyBpYW0ub3JnX2ludnM6ciBpYW0ub3JnX2ludnM6dyBpYW0ub3JnX21icnM6ciBpYW0ub3JnX21icnM6dyBpYW0ub3JnX21icnNfcm9sZXM6dyBpYW0ucm9sZXM6ciBpYW0udXNyX3JvbGVzOnIgeG1jbG91ZGRlcGxveS5wcm9qZWN0czptYW5hZ2UgeG1jbG91ZGRlcGxveS5lbnZpcm9ubWVudHM6bWFuYWdlIHhtY2xvdWRkZXBsb3kub3JnYW5pemF0aW9uczptYW5hZ2UgeG1jbG91ZGRlcGxveS5kZXBsb3ltZW50czptYW5hZ2UgeG1jbG91ZGRlcGxveS5tb25pdG9yaW5nLmRlcGxveW1lbnRzOnJlYWQgeG1jbG91ZGRlcGxveS5jbGllbnRzOm1hbmFnZSB4bWNsb3VkZGVwbG95LnNvdXJjZWNvbnRyb2w6bWFuYWdlIHhtY2xvdWRkZXBsb3kucmg6bW5nIHhtY2xvdWRkZXBsb3kuc2l0ZTptbmcgeG1jbG91ZC5jbTphZG1pbiB4bWNsb3VkLmNtOmxvZ2luIGNvbm5lY3Qud2ViaG9va3M6cmVhZCBjb25uZWN0LndlYmhvb2tzOmNyZWF0ZSBjb25uZWN0LndlYmhvb2tzOnVwZGF0ZSBjb25uZWN0LndlYmhvb2tzOmRlbGV0ZSBwbGF0Zm9ybS50ZW5hbnRzOmxpc3RhbGwgYmFja2JvbmUuZXZlbnRzOmVuYWJsZSBiYWNrYm9uZS5ldmVudHM6ZGlzYWJsZSB1aS5leHRlbnNpb25zOnJlYWQgZWRnZS50b2tlbnM6Y3JlYXRlIGVkZ2UudG9rZW5zOnJlYWQgZWRnZS50b2tlbnM6ZGVsZXRlIGVkZ2UudG9rZW5zOnVwZGF0ZSBoYy5tZ21udC50eXBlczp3cml0ZSBoYy5tZ21udC5hcGlrZXlzOm1hbmFnZSBoYy5tZ21udC50eXBlczpyZWFkIGhjLm1nbW50Lm1lZGlhOm1hbmFnZSBoYy5tZ21udC5zdGF0ZXM6cHVibGlzaCBoYy5tZ21udC5pdGVtczptYW5hZ2UgaGMubWdtbnQudXNlcnM6cmVhZCBoYy5tZ21udC5jbGllbnRzOnJlYWQgaGMubWdtbnQudGF4b25vbWllczpyZWFkIGhjLm1nbW50LnRheG9ub21pZXM6d3JpdGUgaGMubWdtbnQubG9jYWxlczpyIGhjLm1nbW50LmxvY2FsZXM6dyBoYy5tZ21udC5zZXR0aW5nczpyIGhjLm1nbW50LnNldHRpbmdzOm0gbW1zLnVwbG9hZC5maWxlOmFkZCBtbXMudXBsb2FkLmZpbGU6cmVtb3ZlIGNtcC5zaXRlczpjcmVhdGUgY21wLnNpdGVzOnJlYWQgY21wLmNvbGxlY3Rpb25zOmNyZWF0ZSBjbXAuY29sbGVjdGlvbnM6cmVhZCBjbXAuY29sbGVjdGlvbnM6ZGVsZXRlIGNtcC5jb21wb25lbnRzOmNyZWF0ZSBjbXAuY29tcG9uZW50czpyZWFkIGNtcC5jb21wb25lbnRzOmRlbGV0ZSBjbXAuZGF0YXNvdXJjZXM6Y3JlYXRlIGNtcC5kYXRhc291cmNlczpyZWFkIGNtcC5kYXRhc291cmNlczpkZWxldGUgY21wLnN0eWxlczpyZWFkIGNtcC5zdHlsZXM6dXBkYXRlIGNtcC5zdHlsZXM6ZGVsZXRlIGNtcC5wcm94eTpyZWFkIGNtcC5ibG9iczpjcmVhdGUgc3VwcG9ydC50aWNrZXRzOmNyZWF0ZSBzZWFyY2gucG9ydGFsOm1hbmFnZSBzZWFyY2guZGlzY292ZXI6bWFuYWdlIHNlYXJjaC5hZG1pbjptYW5hZ2Ugc2VhcmNoLmludGVybmFsOm1hbmFnZSBzZWFyY2gudXRpbDptYW5hZ2Ugc2VhcmNoLmFjY291bnQ6bWFuYWdlIGRpc2NvdmVyLnBvcnRhbDptYW5hZ2UgZGlzY292ZXIuc2VhcmNoLXJlYzptYW5hZ2UgZGlzY292ZXIuYWRtaW46bWFuYWdlIGRpc2NvdmVyLmludGVybmFsOm1hbmFnZSBkaXNjb3Zlci51dGlsOm1hbmFnZSBkaXNjb3Zlci5ldmVudDptYW5hZ2UgZGlzY292ZXIuYWNjb3VudDptYW5hZ2UgZm9ybXMuZW5kcG9pbnRzOnJlYWQgZm9ybXMuZW5kcG9pbnRzOmNyZWF0ZSBmb3Jtcy5lbmRwb2ludHM6dXBkYXRlIGZvcm1zLmVuZHBvaW50czpkZWxldGUgZm9ybXMuc3VibWlzc2lvbnM6cmVhZCBmb3Jtcy5zdWJtaXNzaW9uczpjcmVhdGUgZm9ybXMuc3VibWlzc2lvbnM6dXBkYXRlIGZvcm1zLnN1Ym1pc3Npb25zOmRlbGV0ZSBmb3Jtcy5leHBvcnRzOmNyZWF0ZSBmb3Jtcy5leHBvcnRzOnJlYWQgYXVkaXQubG9nczpyIGNvbm5lY3Qub3JnOnIgY29ubmVjdC5vcmcudG50OnIgY29ubmVjdC5yY3A6YyBjb25uZWN0LnJjcDpyIGNvbm5lY3QucmNwOnUgY29ubmVjdC5yY3A6ZCBjb25uZWN0LmNvbjpjIGNvbm5lY3QuY29uOnIgY29ubmVjdC5jb246dSBjb25uZWN0LmNvbjpkIGNvbm5lY3QuZmxkcjpjIGNvbm5lY3QuZmxkcjpyIGNvbm5lY3QuZmxkcjpkIGNvbm5lY3QubGNsLmltcDpjIGNvbm5lY3QubGNsLmltcDpyIGNvbm5lY3QubGNsLmV4cDpjIGNvbm5lY3QubGNsLmV4cDpyIGNvbm5lY3QucHJvajpyIGNvbm5lY3QucHJvajpkIGVwLmFkbW4ub3Jncy5oc3RubWU6ciBlcC5hZG1uLm9yZ3MuaHN0bm1lOncgZXAudXNyLmN0eDpyIGVwLnVzci5jdHg6dyBlcC51c3IuY3R4X3JlczpyIGVwLnVzci5jdHhfcmVzOncgeG1hcHBzLmNvbnRlbnQ6Z2VuIGFpLm9yZy5icmQ6bCBhaS5vcmcuYnJkOnIgYWkub3JnLmJyZDp3IGFpLm9yZy5lZzpyIGFpLm9yZy5lZzp3IGFpLm9yZy5jaHRzOnIgYWkub3JnLmNodHM6dyBhaS5vcmcuZG9jczpyIGFpLm9yZy5kb2NzOncgYWkub3JnLmJyaTpyIGFpLm9yZy5icmk6dyBhaS5nZW4uY21wOnIgYWkuZ2VuLmNtcDp3IGFpLnJlYy52YXI6dyBhaS5yZWMudmFyOnIgYWkucmVjLmh5cDp3IGFpLnJlYy5oeXA6ciBhaS5vcmc6YWRtaW4gYWkub3JnOnVzZXIgbW1zLmRlbGl2ZXJ5OnIgY3MuYWxsOmVkaXRvciBjcy5hbGw6YWRtaW4geG1jcHViLnF1ZXVlOnIgeG1jcHViLmpvYnMuYTp3IHhtY3B1Yi5qb2JzLmE6ciBta3AuYXBwczpyIG1rcC5hcHBzOncgbWtwLmNsaWVudHM6ciBta3AuY2xpZW50czp3IG1rcC5hcHBpbnN0bHM6ciBta3AuYXBwaW5zdGxzOnciLCJhenAiOiJDaGk4RXdmRm5FZWprc2szU2VkOWhsYWxHaU05QjJ2NyJ9.Yzz5VwPd9LrMPP__Vfdn2G1W5MH5w1vfNy72D-ML6bkjocxH5Pe4ucpuZCmXVkR5o81b1LmcvEu2UN34Pt0nRZDkHG7DCyJPnSYp1hjmahlT78rmS4BicWqj9E9yXdocYOOO98glIZiC2Dp6jgdZZTtubvjFFz3A5P4ufZIcN2zw_l0nxFfsAqzbcTJX14ffHM2e7Z9zHoqucXAQkJa8_qrIj-OnSvSx9JM1m4zgMb3g1xplAEX3imwli_4jQEPcLw7k8Kqh9Y0avTt7HoknDUsY-xeOCixBJN2XKQqlcss75Mx4BCJPGUkp323KRnYuIvxJNE0F71HZPc06PgSVog',
    },
    body: JSON.stringify({ query: mutation, variables }),
  });
}
