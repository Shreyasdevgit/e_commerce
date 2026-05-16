import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success('Signup successful! Please check your email.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-margin-mobile">
      <div className="max-w-md w-full bg-white p-8 border border-outline-variant">
        <h2 className="font-headline-md text-headline-md uppercase mb-8 text-center">
          {isLogin ? 'Login to Cartify' : 'Join Cartify'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="font-label-md text-label-md uppercase block mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="font-label-md text-label-md uppercase block mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-label-md text-label-md uppercase block mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
