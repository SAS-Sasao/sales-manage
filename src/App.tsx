import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import MenuGrid from './components/menu/MenuGrid';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto py-4">
          <MenuGrid />
        </div>
      </main>
    </div>
  );
}

export default App;
