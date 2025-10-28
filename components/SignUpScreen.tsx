import React, { useState } from 'react';
import { createUser } from '../services/dataService';
import { validatePassword } from '../utils/validation';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = createUser(name, username, password);
    if (result.success) {
      setSuccess(`${result.message} You will be redirected to login shortly.`);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-[#0e1621]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#18222d] rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400">Create Rchat Account</h1>
          <p className="mt-2 text-gray-400">Join the conversation!</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Display Name"
            />
            <label htmlFor="name" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">
              Display Name
            </label>
          </div>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Username"
            />
            <label htmlFor="username" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">
              Username
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Password"
            />
            <label htmlFor="password" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Confirm Password"
            />
            <label htmlFor="confirmPassword" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">
              Confirm Password
            </label>
          </div>
          
          <ul className="text-xs text-gray-400 list-disc list-inside space-y-1 pt-1">
              <li>At least 8 characters</li>
              <li>An uppercase and a lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
          </ul>

          {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
          {success && <p className="text-sm text-green-400 text-center pt-2">{success}</p>}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 mt-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform transform hover:scale-105"
            >
              Create Account
            </button>
          </div>
        </form>
        <div className="text-center">
          <button onClick={onSwitchToLogin} className="text-sm text-cyan-400 hover:underline">
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
