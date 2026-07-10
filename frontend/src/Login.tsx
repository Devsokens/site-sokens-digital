import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError('Email ou mot de passe incorrect.');
    } else {
      navigate('/admin');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex items-center justify-center px-4 overflow-hidden">
      {/* Glow effects */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-900/20 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/assets/Logo_SOKENS_DIGITAL-removebg-preview.png"
            alt="Sokens Digital"
            className="h-12 object-contain mx-auto mb-3"
          />
          <p className="text-gray-500 mt-2">Accès Administration</p>
        </div>

        {/* Card */}
        <div className="bg-black/40 border border-gray-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
          <h1 className="text-2xl font-bold mb-6">Connexion</h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sokens.digital"
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
