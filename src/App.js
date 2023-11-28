import logo from './logo.svg';
import './App.css';
import profile1 from './assets/profile1.jpg'
import Home from "./pages/Home";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Example from './Exemple';
import { useState } from 'react';
import { ContextProvider } from './context/ContextProvider';    


const App=()=> {
  
  return (
    <ContextProvider>
      <Index />
    </ContextProvider>
  );
}

export default App;
