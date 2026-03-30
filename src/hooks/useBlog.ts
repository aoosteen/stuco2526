import { useState, useEffect, useCallback } from 'react';
import { sanityClient, urlFor } from '../lib/sanity';

export interface PostListItem {
  id: string;
  title: string;
  excerpt: string;
  dateStr: string;
  date: string;
  category: string;
  image: string;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sanityClient.fetch(`*[_type == "Blogs"] | order(publishedAt desc, _createdAt desc) {
        _id,
        title,
        author,
        category,
        coverImage,
        description,
        publishedAt,
        _createdAt
      }`);

      const formatted = data.map((blog: any) => {
        const dateObj = new Date(blog.publishedAt || blog._createdAt);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
        
        return {
          id: blog._id,
          title: blog.title,
          excerpt: blog.description || '',
          dateStr: dateObj.toISOString(),
          date: dateObj.toLocaleDateString('en-US', options),
          category: blog.category || 'Event/Programme',
          image: blog.coverImage ? urlFor(blog.coverImage).url() : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
        };
      });
      setPosts(formatted);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}

export function useBlogPost(id: string | undefined) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPost = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const query = `*[_type == "Blogs" && _id == $id][0]`;
      const data = await sanityClient.fetch(query, { id });
      setPost(data);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
}

// Default export as a unified hook if preferred
export function useBlog() {
  return {
    usePosts: useBlogPosts,
    usePost: useBlogPost
  };
}
