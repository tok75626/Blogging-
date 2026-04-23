'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks/useStore';
import Link from 'next/link';

export default function Home() {
  const { posts, fetchPosts, loading } = useStore();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    loadPosts(1);
  }, []);

  const loadPosts = async (page) => {
    const data = await fetchPosts({ search, page });
    if (data?.pagination) setPagination(data.pagination);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    fetchPosts({ search: term, page: 1 });
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem' }}>
          Future of <span style={{ color: 'var(--primary)' }}>Blogging</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Experience production-grade AI content generation with a sleek, high-perf interface.
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/posts/create" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Create New Blog Post
          </Link>
        </div>

        <div style={{ marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search amazing posts..." 
            value={search}
            onChange={handleSearch}
            style={{ borderRadius: '40px', padding: '1rem 2rem' }}
          />
        </div>
      </header>

      {loading && <div style={{ textAlign: 'center' }}>Loading the magic...</div>}

      <div className="grid-posts">
        {posts.map((post) => (
          <Link href={`/posts/${post._id}`} key={post._id} className="glass-card animate-fade-in" style={{ display: 'block' }}>
            {post.coverImage ? (
              <img src={post.coverImage} className="post-card-img" alt={post.title} />
            ) : (
              <div className="post-card-img" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-dim)' }}>No Image</span>
              </div>
            )}
            <span style={{ 
              background: 'rgba(99, 102, 241, 0.2)', 
              color: 'var(--primary)', 
              padding: '0.2rem 0.8rem', 
              borderRadius: '20px', 
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {post.category || 'General'}
            </span>
            <h2 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>{post.title}</h2>
            <p style={{ color: 'var(--text-dim)', margin: '1rem 0', fontSize: '0.95rem' }}>
              {post.summary || (post.content || '').substring(0, 150) + '...'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'white', fontWeight: '500' }}>By {post.author?.name}</span>
              <span style={{ color: 'var(--text-dim)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>

      {!loading && posts.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4rem' }}>
          <button 
            disabled={pagination.page <= 1} 
            onClick={() => loadPosts(pagination.page - 1)}
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-dim)' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            disabled={pagination.page >= pagination.pages} 
            onClick={() => loadPosts(pagination.page + 1)}
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
          >
            Next
          </button>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
          No posts found. Be the first to create one!
        </div>
      )}
    </div>
  );
}
