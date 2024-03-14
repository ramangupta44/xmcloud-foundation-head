import { gql } from '@apollo/client';
export const GlobalUniversity_Blog_Listing_Query = gql`
  query BlogListing($path: String, $template: String, $orderBy: ItemSearchOrderByInput) {
    BlogListingData: search(
      where: {
        AND: [
          { name: "_path", value: $path, operator: CONTAINS }
          { name: "_templates", value: $template, operator: EQ }
        ]
      }
      first: 10
      orderBy: $orderBy
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        ... on BlogDetails {
          title {
            value
          }
          thumbnailImage {
            value
            jsonValue
          }
          content {
            value
          }
        }
        url {
          path
        }
      }
    }
  }
`;
