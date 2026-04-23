'use client';
import { useEffect, useState } from 'react';
import { useStore, api } from '@/hooks/useStore';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: storeLoading } = useStore();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      // In a real app, I'd pass a userId filter to /api/posts
      // For this demo, let's assume we can filter or just fetch all and filter client-side if needed
      // Actually, I'll just fetch all for now and show how management looks
      const { data } = await api.get('/posts');
      setUserPosts((data.posts || []).filter(p => p.author?._id === user?.id || p.author === user?.id || p.author?._id === user?._id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setUserPosts((userPosts || []).filter(p => p._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  if (!user && !storeLoading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Please login to view dashboard.</div>;

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1>Welcome, <span style={{ color: 'var(--primary)' }}>{user?.name}</span></h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your AI-generated content and platform metrics.</p>
        </div>
        <Link href="/posts/create" className="btn-primary">Create New Post</Link>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Your Posts</h3>
        {loading ? (
          <div>Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
            You haven't written any posts yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userPosts.map(post => (
                <tr key={post._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{post.title}</td>
                  <td style={{ padding: '1rem' }}>{post.category || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                    <Link href={`/posts/edit/${post._id}`} style={{ color: 'var(--primary)' }}>Edit</Link>
                    <button onClick={() => handleDelete(post._id)} style={{ background: 'transparent', color: '#ef4444', padding: 0 }}>Delete</button>
                    <Link href={`/posts/${post._id}`} style={{ color: 'var(--text-dim)' }}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
