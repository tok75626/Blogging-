'use client';
import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
import { useEffect } from 'react';

export default function Layout({ children }) {
  const { user, initAuth, logout } = useStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" className="nav-logo">AI BLOG PRO</Link>
          <div className="nav-links">
            <Link href="/">Feed</Link>
            {user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/posts/create">Create</Link>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.name}</span>
                <button onClick={logout} style={{ background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border)' }}>
        © 2026 AI Blog Pro - Production Grade Platform
      </footer>
    </>
  );
}
