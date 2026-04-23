'use client';
import { useEffect, useState } from 'react';
import { useStore, api } from '@/hooks/useStore';
import { useRouter, useParams } from 'next/navigation';

export default function EditPost() {
  const { id } = useParams();
  const { loading } = useStore();
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: []
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPostData(data);
      } catch (e) {
        alert('Failed to load post');
        router.push('/dashboard');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${id}`, postData);
      router.push('/dashboard');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Edit <span style={{ color: 'var(--primary)' }}>Post</span></h1>

      <form onSubmit={handleSubmit} className="glass-card animate-fade-in">
        <div className="form-group">
          <label className="form-label">Post Title</label>
          <input 
            className="form-input" 
            value={postData.title}
            onChange={(e) => setPostData({...postData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input 
            className="form-input" 
            value={postData.category}
            onChange={(e) => setPostData({...postData, category: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea 
            className="form-input" 
            style={{ minHeight: '300px', resize: 'vertical' }}
            value={postData.content}
            onChange={(e) => setPostData({...postData, content: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Summary</label>
          <textarea 
            className="form-input" 
            value={postData.summary}
            onChange={(e) => setPostData({...postData, summary: e.target.value})}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
