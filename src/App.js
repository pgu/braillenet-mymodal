import React from 'react';
import './App.css';
import Modal from './components/Modal';

const App = () => {
  return (
    <main className="content">
      <p lang="la">Lorem ipsum dolor sit amet...</p>
      <p>Lorem ipsum dolor sit amet...
        <Modal></Modal>
      </p>
      <p lang="la">Lorem ipsum dolor sit amet...</p>
    </main>
  );
};


export default App;
