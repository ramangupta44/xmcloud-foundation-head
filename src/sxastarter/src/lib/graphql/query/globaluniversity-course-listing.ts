import { gql } from '@apollo/client';
export const GlobalUniversity_Course_Listing_Query = gql`
  query CourseListing(
    $path: String
    $keyword: String
    $CourseType: String
    $CourseCategory: String
  ) {
    CourseListingData: search(
      where: {
        AND: [
          { name: "_path", value: $path, operator: CONTAINS }
          { name: "Title", value: $keyword, operator: CONTAINS }
          { name: "CourseType", value: $CourseType, operator: CONTAINS }
          { name: "CourseCategory", value: $CourseCategory, operator: CONTAINS }
        ]
      }
      first: 10
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
        }
        courseDescription {
          value
        }
        courseType {
          targetItems {
            name
          }
        }
        studentType {
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
