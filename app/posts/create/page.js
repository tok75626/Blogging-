'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const { generateAIContent, createPost, uploadFile, loading } = useStore();
  const [prompt, setPrompt] = useState('');
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    coverImage: '',
    tags: []
  });
  const router = useRouter();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setPostData({ ...postData, coverImage: url });
    } catch (e) {
      alert('Upload failed');
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return alert('Enter a prompt first');
    try {
      const data = await generateAIContent(prompt);
      setPostData(prev => ({
        ...prev,
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: prev.coverImage, // preserve any uploaded image
      }));
    } catch (e) {
      alert('AI Generation failed. Fallback triggered but failed as well.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(postData);
      router.push('/dashboard');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create with <span style={{ color: 'var(--primary)' }}>AI Assistant</span></h1>
      
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>AI Command Center</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
          Describe what you want to write about, and our dual-provider AI will handle the rest.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Write a post about the future of Quantum Computing in 2026" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            className="btn-primary" 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

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
          <label className="form-label">Cover Image</label>
          <input 
            type="file" 
            className="form-input" 
            accept="image/*"
            onChange={handleFileUpload}
          />
          {postData.coverImage && (
            <div style={{ marginTop: '1rem', position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '200px' }}>
              <img src={postData.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
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
          <label className="form-label">Content (Markdown supported)</label>
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
          <button type="submit" className="btn-primary" disabled={loading}>
            Publish Post
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
