import React, { useState } from 'react';
import './Movie.css';
import Seats from '../Seats/Seats'

function Movie() {
    const [page,setPage] = useState(0);

  return (
      <div>
        <div className='movie' onClick={()=>setPage(1)}></div>
        <div>
            {page===1?<div className='info'>
            <div className='photo'></div>
            <h2 className='buy' onClick={()=>setPage(2)}>Comprar</h2>
            {console.log(page)}
        </div>:page===2?
    <div className='select'>
        <Seats/>
        {console.log(page)}
    </div>:null}
    </div>
      </div>
    
  );
}

export default Movie;