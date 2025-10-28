import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser } from '../services/dataService';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSwitchToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username.trim() && password.trim()) {
      const user = authenticateUser(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password.');
      }
    } else {
      setError('Please enter a username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-[#0e1621]">
      <div className="w-full max-w-sm p-8 space-y-8 bg-[#18222d] rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400">Rchat</h1>
          <p className="mt-2 text-gray-400">Welcome back! Please login to your account.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
             <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Username"
            />
             <label
                htmlFor="username"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm"
             >
                Username
             </label>
          </div>
          <div className="relative">
             <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Password"
            />
             <label
                htmlFor="password"
                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm"
             >
                Password
             </label>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-400">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignUp} className="font-medium text-cyan-400 hover:underline">
                  Sign Up
              </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;