import React from 'react';
import './App.css';
import LogReg from '../Components/LogReg/LogReg'
import Movie from '../Components/Movie/Movie'

function App() {
  return (
    <div>
      <div><LogReg/></div>
      <div className='movies'>
        <Movie/>
      </div>
    </div>
    
  );
}


export default App;