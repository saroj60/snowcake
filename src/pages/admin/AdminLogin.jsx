import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/db';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const { user, error: loginError } = await login(email, password);
    
    setIsLoading(false);
    if (loginError) {
      setError(loginError);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container-low rounded-2xl p-8 shadow-xl border border-outline-variant/20">
        <div className="text-center mb-8">
          <h1 className="font-headline-lg text-3xl text-primary font-bold mb-2">Snow Cakes</h1>
          <p className="text-on-surface-variant">Admin Control Panel</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="admin@snowcakes.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-on-surface-variant mt-6">
          Use admin@snowcakes.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
