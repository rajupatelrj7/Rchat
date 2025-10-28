
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import ChatInterface from './components/ChatInterface';
import { User } from './types';

type AuthScreen = 'login' | 'signup';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleSwitchToSignUp = () => {
    setAuthScreen('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthScreen('login');
  };

  if (!currentUser) {
    switch (authScreen) {
      case 'signup':
        return <SignUpScreen onSwitchToLogin={handleSwitchToLogin} />;
      case 'login':
      default:
        return <LoginScreen onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
    }
  }

  return (
    <div className="h-screen w-screen text-white antialiased">
      <ChatInterface currentUser={currentUser} onUserUpdate={handleUserUpdate} />
    </div>
  );
};

export default App;
