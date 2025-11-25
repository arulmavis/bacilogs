import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password);
      navigate('/dashboard'); // Redirect to a dashboard or home page after signup
    } catch (err) {
      setError('Failed to create an account. ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} type="submit">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}

export default SignupPage;