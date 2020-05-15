import React,{useState} from 'react';
import './Seats.css'
import seat from '../../Assets/seat-black.svg'

function Seats(){

}


function Seat(){
    const [type,setType] = useState();
    <div className='seat'>
        <img src={seat} alt=""/>
    </div>
}

export default Seats;