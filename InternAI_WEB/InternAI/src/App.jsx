import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Backend API'ye GET isteği gönderiyoruz
    fetch('http://localhost:8080/internai/api/test')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>{message ? message : 'Loading...'}</h1>
    </div>
  );
}

export default App;

