import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

export default function RegisterPage() {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const data = await registerUser(form);
    setLoading(false);
    if (data.token) {
      login(data);
      navigate('/play');
    } else {
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '20px',
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '24px', padding: '48px 40px', width: '100%',
        maxWidth: '420px', boxShadow: 'var(--shadow)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>&#127775;</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
          Join the Journey
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '15px' }}>
          Create your guide identity to help Benny get home!
        </p>

        {error && (
          <div style={{
            background: '#f4433620', border: '1px solid var(--error)',
            color: 'var(--error)', borderRadius: '12px', padding: '12px',
            marginBottom: '20px', fontSize: '14px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            placeholder='Choose a username'
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
            style={{
              background: 'var(--card2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '14px 16px',
              color: 'var(--text)', fontSize: '15px', width: '100%',
            }}
          />
          <input
            type='password'
            placeholder='Choose a password'
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={{
              background: 'var(--card2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '14px 16px',
              color: 'var(--text)', fontSize: '15px', width: '100%',
            }}
          />
          <button type='submit' disabled={loading} style={{
            background: loading ? 'var(--text2)' : 'linear-gradient(135deg, #ff6b35, #f7c948)',
            color: 'white', borderRadius: '12px', padding: '14px',
            fontSize: '16px', fontWeight: 'bold', width: '100%',
            boxShadow: '0 4px 15px rgba(255,107,53,0.4)',
          }}>
            {loading ? 'Creating Guide...' : 'Start the Journey 🌟'}
          </button>
        </form>

        <div style={{
          marginTop: '24px', padding: '16px', background: 'var(--card2)',
          borderRadius: '12px', border: '1px solid var(--border)',
        }}>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            Already a guide?{' '}
            <a href='/login' style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}