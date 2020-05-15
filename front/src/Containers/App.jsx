import React,{useState} from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/client';
import client from '../Components/Client/Client'
import LogReg from '../Components/LogReg/LogReg'
import Movies from '../Components/Movies/Movies'

function App() {
  const [name, setName] = useState(null);
  return (
    <ApolloProvider client={client}>
    <div className='app'>
      <div><LogReg setName={setName}/></div>
      <div className='billboard'>
        {name===1?null:<Movies/>}
      </div>
    </div>
    </ApolloProvider>
  );
}


export default App;