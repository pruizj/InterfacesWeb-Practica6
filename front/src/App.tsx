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
import styled from "styled-components";

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
      <LayOut>
        <Contact reloadHandler={reloadHandler}></Contact>
        <ContactList inputvalue={statepage}></ContactList>
      </LayOut>
    </ApolloProvider>
  );
}

const LayOut = styled.div` 
  display:flex;
  flex-direction: column;
  justify: center;
`
export default App;