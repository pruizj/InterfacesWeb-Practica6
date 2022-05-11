import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
}from "@apollo/client";
import ContactList from './components/ContactList';
import Contact from './components/Contact';

function App() {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache(),
  });

  console.log(`API URL ${process.env.REACT_APP_API_URL}`);

  const [reload, setReload] = useState<boolean>(true);
  const [statepage, setStatepage]= useState<number>(1);

  const reloadHandler = (value:number) => {
    if(value){
      setStatepage(value);
    }
    setReload(!reload);
  }



  return (
    <ApolloProvider client= {client}>
      <ContactList inputvalue={statepage}></ContactList>
      <Contact reloadHandler={reloadHandler}></Contact>
    </ApolloProvider>
  );
}

export default App;