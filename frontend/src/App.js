import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { AuthProvider } from './context/AuthContext'
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter/>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
