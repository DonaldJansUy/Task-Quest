import React, { useState } from 'react';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import { AuthContextProvider } from '../components/_utils/auth-context';

const App = () => {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomePage setView={setView} />;
      case 'profile':
        return <ProfilePage setView={setView} />;
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <AuthContextProvider>
      <div className="app">
        {renderView()}
      </div>
    </AuthContextProvider>
  );
};

export default App;
