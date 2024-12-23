import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

// Define TypeScript interfaces for the GraphQL response
interface GraphQLField {
  name: string;
  value: string;
}

interface GraphQLResult {
  id: string; // Sitecore item unique ID
  fields: GraphQLField[]; // Fields array with name and value
}

interface GraphQLPageInfo {
  endCursor: string | null; // Cursor for the next page
  hasNextPage: boolean; // Indicates if there is another page
}

interface GraphQLResponse {
  data?: {
    item?: {
      children?: {
        pageInfo: GraphQLPageInfo;
        results: GraphQLResult[];
      };
    };
  };
}

// Interface for mapped blog items
interface BlogItem {
  id: string; // ID from "ID" field value
  title: string; // Title field
  content: string; // Content field
}

const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch blog posts from Sitecore GraphQL with pagination
  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const query = `
        query ($first: Int!, $after: String) {
          item(path: "/sitecore/content/EspireDemo/Espire/Home/Blog", language: "en") {
            children(first: $first, after: $after) {
              pageInfo {
                endCursor
                hasNext
              }
              results {
                id
                fields {
                  name
                  value
                }
              }
            }
          }
        }
      `;

      const variables = {
        first: 200, // Number of items per page
        after: null as string | null, // Initial cursor
      };

      let allPosts: BlogItem[] = [];
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await fetch('https://xmcloudcm.localhost/sitecore/api/graph/edge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            sc_apikey: '4BDCDFA9-4555-483C-BA72-C246EA79F02B', // Replace with your API key
          },
          body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Sitecore blog items: ${response.status}`);
        }

        const result: GraphQLResponse = await response.json();

        // Log the response for debugging
        console.log('GraphQL Response:', JSON.stringify(result, null, 2));

        // Defensive checks for GraphQL response structure
        if (
          !result.data ||
          !result.data.item ||
          !result.data.item.children ||
          !result.data.item.children.results
        ) {
          throw new Error('Unexpected GraphQL response structure');
        }

        // Map the current page's results to BlogItem format
        const currentPagePosts: BlogItem[] = result.data.item.children.results.map((item) => ({
          id: item.fields.find((field) => field.name === 'ID')?.value || 'No ID',
          title: item.fields.find((field) => field.name === 'Title')?.value || 'No Title',
          content: item.fields.find((field) => field.name === 'Content')?.value || 'No Content',
        }));

        // Append the current page's results to the full list
        allPosts = [...allPosts, ...currentPagePosts];

        // Update pagination variables
        hasNextPage = result.data.item.children.pageInfo.hasNextPage;
        variables.after = result.data.item.children.pageInfo.endCursor;
      }

      setPosts(allPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h1 className="my-4 text-center" style={{ fontWeight: 600, color: '#333' }}>
        Sitecore Blog Posts
      </h1>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: '#0d6efd' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}
      {!loading && !error && posts.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {posts.map((post) => (
            <Col key={post.id}>
              <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: 700, color: '#000' }}>{post.title}</Card.Title>
                  <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>
                    {post.content}
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  className="text-muted text-center"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #ddd',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong>ID:</strong> {post.id}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center">No blog posts available in Sitecore.</p>
      )}
    </Container>
  );
};

export default BlogPosts;
