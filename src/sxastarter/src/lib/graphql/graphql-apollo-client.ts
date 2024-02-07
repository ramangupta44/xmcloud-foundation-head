import { ApolloClient, InMemoryCache } from '@apollo/client';
export const apolloClient = new ApolloClient({
  // uri: `https://edge.sitecorecloud.io/api/graphql/v1/`,
  // uri: `https://xmcloudcm.localhost/sitecore/api/graph/edge`,
  uri: `https://xmc-espireinfold380-globaluniveead6-dev.sitecorecloud.io/sitecore/api/graph/edge`,
  cache: new InMemoryCache({}),
  headers: {
    'Content-Type': 'application/json',
    Authorization: '563a6205e5704de89bf82fb065cdef5f',
    sc_apikey: '563a6205e5704de89bf82fb065cdef5f',
    // Authorization: '{CFDF8EA4-553C-4C33-9C61-BA82E03502A5}',
    // sc_apikey: '{CFDF8EA4-553C-4C33-9C61-BA82E03502A5}',
    // Authorization:
    // 'QmFvVHh3aTZzbmEveTNPeiszNktNZkZnNGtQZ2ExWUF5NXhpQ2ZMM3VrOD18ZXNwaXJlaW5mb2xkMzgwLWdsb2JhbHVuaXZlZWFkNi1kZXYtYzExNQ==',
    // sc_apikey:
    // 'QmFvVHh3aTZzbmEveTNPeiszNktNZkZnNGtQZ2ExWUF5NXhpQ2ZMM3VrOD18ZXNwaXJlaW5mb2xkMzgwLWdsb2JhbHVuaXZlZWFkNi1kZXYtYzExNQ==',
  },
});
