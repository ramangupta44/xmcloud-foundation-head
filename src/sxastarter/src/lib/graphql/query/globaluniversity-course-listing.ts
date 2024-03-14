import { gql } from '@apollo/client';
export const GlobalUniversity_Course_Listing_Query = gql`
  query CourseListing(
    $path: String
    $template: String
    $keyword: ItemSearchPredicateInput
    $courseType: ItemSearchPredicateInput
    $courseCategory: ItemSearchPredicateInput
    $orderBy: ItemSearchOrderByInput
  ) {
    CourseListingData: search(
      where: {
        AND: [
          { name: "_path", value: $path, operator: CONTAINS }
          { name: "_templates", value: $template, operator: EQ }
          $keyword
          $courseType
          $courseCategory
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
        ... on Courses {
          title {
            value
          }
          image {
            value
            jsonValue
          }
          thumbnailImage {
            value
            jsonValue
          }
          applyNowURL {
            jsonValue
          }
          content {
            value
          }
          courseType {
            targetItems {
              name
            }
          }
          studyMode {
            targetItems {
              name
            }
          }
          location {
            targetItems {
              name
            }
          }
        }
        url {
          path
        }
      }
    }
  }
`;
