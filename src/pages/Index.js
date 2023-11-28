import React,{useState} from 'react'
import {useStateContext } from './../context/ContextProvider';
import Home from "./../pages/Home";
import Login from "./../pages/Login";

const Index = () => {
    const [isConnected,setIsConnected] = useState(localStorage.getItem('connected'));
  return (
    isConnected==="true"?<Home />:<Login />
  );
}

export default Index