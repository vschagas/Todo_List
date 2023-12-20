import React from 'react';
import ReactDOM from 'react-dom/client';
import TaskList from './Home';
import './index.css';
// import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskList />
  </React.StrictMode>
);
