import React, { useEffect, useState, startTransition } from 'react';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const BlogPosts = () => {
  const [hydrated, setHydrated] = useState(false); // Hydration flag
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set the hydration flag to true on the client side
  useEffect(() => {
    startTransition(() => {
      setHydrated(true);
    });
  }, []);

  // Fetch posts only after hydration is complete
  useEffect(() => {
    if (hydrated) {
      startTransition(() => {
        setLoading(true);
        const fetchPosts = async () => {
          try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            if (!response.ok) {
              throw new Error(`Failed to fetch posts: ${response.status}`);
            }
            const data = await response.json();
            startTransition(() => {
              setPosts(data);
            });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            startTransition(() => {
              setError(errorMessage);
            });
          } finally {
            startTransition(() => {
              setLoading(false);
            });
          }
        };

        fetchPosts();
      });
    }
  }, [hydrated]);

  // Avoid rendering until hydration is complete
  if (!hydrated) return null;

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h1 className="my-4 text-center" style={{ fontWeight: 600, color: '#333' }}>
        Blog Posts
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
                  <Card.Text style={{ fontSize: '0.95rem', color: '#555' }}>{post.body}</Card.Text>
                </Card.Body>
                <Card.Footer
                  className="text-muted"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #ddd',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong>User ID:</strong> {post.userId} | <strong>Post ID:</strong> {post.id}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center">No posts available.</p>
      )}
    </Container>
  );
};

export default BlogPosts;
