import React, { useState } from 'react';
import { User } from '../types';
import { validatePassword } from '../utils/validation';
import { CloseIcon } from './icons';

type OnSaveHandler = (data: {
  name: string;
  currentPassword: string;
  newPassword?: string;
}) => Promise<{ success: boolean; message: string; user?: User }>;

interface ProfileScreenProps {
  user: User;
  onClose: () => void;
  onSave: OnSaveHandler;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !currentPassword.trim()) {
      setError('Display name and current password are required to make changes.');
      return;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        return;
      }
    }

    setIsLoading(true);

    const result = await onSave({
      name,
      currentPassword,
      newPassword: newPassword || undefined,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#18222d] rounded-2xl shadow-lg m-4 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400">Edit Profile</h1>
          <p className="mt-2 text-gray-400">Update your account details.</p>
        </div>

        <div className="flex flex-col items-center space-y-2">
            <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full border-4 border-cyan-500"/>
            <p className="text-gray-400">@{user.username}</p>
        </div>


        <form className="space-y-4" onSubmit={handleSubmit}>
           <div className="relative">
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Display Name"/>
            <label htmlFor="name" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">Display Name</label>
          </div>
          
          <hr className="border-gray-600" />
          
          <p className="text-sm text-gray-500 text-center">Enter current password to make changes. To change password, fill all password fields.</p>

          <div className="relative">
            <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Current Password"/>
            <label htmlFor="currentPassword" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">Current Password *</label>
          </div>
          <div className="relative">
            <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="New Password"/>
            <label htmlFor="newPassword" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">New Password</label>
          </div>
          <div className="relative">
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="peer w-full bg-[#24303d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Confirm New Password"/>
            <label htmlFor="confirmPassword" className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm">Confirm New Password</label>
          </div>

          {newPassword && (
            <ul className="text-xs text-gray-400 list-disc list-inside space-y-1 pt-1">
                <li>At least 8 characters</li>
                <li>An uppercase and a lowercase letter</li>
                <li>At least one number & one special character</li>
            </ul>
          )}

          {error && <p className="text-sm text-red-500 text-center pt-2">{error}</p>}
          {success && <p className="text-sm text-green-400 text-center pt-2">{success}</p>}

          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-3 mt-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:scale-100">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;
