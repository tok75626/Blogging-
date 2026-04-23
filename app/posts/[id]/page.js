'use client';
import { useEffect, useState } from 'react';
import { api } from '@/hooks/useStore';
import { useParams } from 'next/navigation';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/posts/${id}`);
        setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Unpacking the content...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '10rem' }}>Post not found.</div>;

  return (
    <article style={{ maxWidth: '800px', margin: '4rem auto' }} className="animate-fade-in">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span style={{ 
          background: 'var(--primary)', 
          color: 'white', 
          padding: '0.3rem 1rem', 
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {post.category || 'General'}
        </span>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginTop: '1.5rem', lineHeight: '1.2' }}>{post.title}</h1>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), #ec4899)' }}></div>
          <span style={{ fontWeight: '600', color: 'white' }}>{post.author?.name}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
        </div>
      </header>

      {post.coverImage && (
        <div style={{ marginBottom: '3rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
        </div>
      )}

      <div className="glass-card" style={{ padding: '3rem', fontSize: '1.15rem', lineHeight: '1.8' }}>
        {post.content.split('\n').map((para, i) => (
          <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p>
        ))}
        
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
