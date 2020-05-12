import React,{useState,useEffect} from 'react';
import './Seats.css'
import seatblack from '../../Assets/seat-black.svg'
import seatgrey from '../../Assets/seat-grey.svg'
import seatgreen from '../../Assets/seat-green.svg'
import cloneDeep from 'clone-deep'

function Seats(){
    const [seats, setSeats] = useState(new Array(108).fill(1));
    const [tickets, setTickets] = useState(1);
    
    return(
        <div className="seats-box">
            <div className='seats'>
                {seats.map((elem,index) => {return <Seat key={index} tickets = {tickets} setTickets={setTickets} type={elem} index={index} seats={seats} setSeats={setSeats}/>})}
            </div>
            <div>
                <h3>{`${tickets} entradas`}</h3>
            </div>
        </div>
        
     
    );

}


function Seat(props) {
    const [type,setType] = useState(props.type);

    useEffect(() => {
        const s = cloneDeep(props.seats);
        s[props.index] = type;
        props.setSeats(s);
        console.log(s);
        const t = cloneDeep(props.tickets);
        type===null?props.setTickets(t):type?props.setTickets(t-1):props.setTickets(t+1);
      }, [type]);
     
    return(
        <div className='seat'>
            <img src={type===null?seatgrey:type?seatblack:seatgreen} alt="1" onClick={type!==null?()=>setType(!type):null}/>
        </div>
    );
    
}

export default Seats;