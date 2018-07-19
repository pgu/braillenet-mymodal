import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from './components/Modal';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }


const App = () => {
  return (
    <main className="content">
      <p lang="la">Lorem ipsum dolor sit amet...</p>
      <p>Lorem ipsum dolor sit amet...<Modal></Modal></p>
      <p lang="la">Lorem ipsum dolor sit amet...</p>
    </main>
  );
}


export default App;
