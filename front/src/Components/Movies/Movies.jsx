import React, { useState,useEffect } from 'react';
import './Movies.css';
import axios from 'axios';
import arrow from '../../Assets/arrow.svg'
import Seats from '../Seats/Seats'
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
function Movies() {
  
  const [info, setInfo] = useState({
    overview:null,
    title: null,
    poster: null,
    date: null
  })

  const [movs,setMovs] = useState([]);

  const GET_ID = gql`
  query getId {

    getId

  }`;

  const { loading, data, error } = useQuery(GET_ID);

  const [char, setChar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [page,setPage] = useState(0);

  const onFilm = (mov) => {

    axios.get(`https://api.themoviedb.org/3/movie/${data.getId[mov]}?api_key=b17961536d16cd4464e388a84acb25d4&language=es-es`)
        .then(response => {
          console.log(Error);
          setInfo({
            overview: response.data.overview,
            title: response.data.title,
            poster: response.data.poster_path,
            date: response.data.date
          });
    })
    axios.get(`https://api.themoviedb.org/3/movie/${data.getId[mov]}/casts?api_key=b17961536d16cd4464e388a84acb25d4&language=es-es`)
        .then(response => {
          console.log(Error);
          console.log(URL)
          const results = response.data.cast.map((result)=>{
            return {
                character:result.character,
                name:result.name,
                profile:result.profile_path,
            }
          });
          const test = results.slice(0,5);
          setChar(test);
    })
    axios.get(`https://api.themoviedb.org/3/movie/${data.getId[mov]}/videos?api_key=b17961536d16cd4464e388a84acb25d4&language=es-es`)
        .then(response => {
          console.log(Error);
          setTrailer(response.data.results[0].key);
    }) 
  }

  if (loading) {
    
    return <div>loading...</div>;

  }else{

    
  
    return (
        <div className='answer'>
          {page===0?
          <div className='movies'>
            {data.getId.map((elem,index)=> {return <Movie key={index} id={elem} index={index} setPage={setPage} onFilm={onFilm}/>})}
          </div>:page===1?
          <div className='total'>
            <img className='arrow' src={arrow} alt="Error" onClick={()=>setPage(0)}/>
            <div className='info'>
            <div className='visual'>
              <img className='poster1' src= {`http://image.tmdb.org/t/p/original//${info.poster}`} alt="Error"/>
              <iframe src={`https://www.youtube.com/embed/${trailer}?fs=0`} width="440" height="280" frameborder="0"></iframe>
            </div>
            <div className='title'>
              <h2>{info.title}</h2>
              <span>{info.overview}</span>
              <div className='characters'>
                {char.map((elem, index)=>{return <Character key={index} char={elem}/>})}
            </div>
            </div>
          </div>
          
          
          </div>:null}
        </div>
    );

  }
}

function Movie(props) {
  const [poster, setPoster] = useState(null);
  
  const {id, setPage, index, onFilm} = props;
  
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=b17961536d16cd4464e388a84acb25d4&language=es-es`)
        .then(response => {
          console.log(Error);
          setPoster(response.data.poster_path);
          console.log(index)
        })  
  },[id]);
  

  return(
      <div className='movie' onClick={()=>{setPage(1);onFilm(index)}}>
        <img className='poster' src= {`http://image.tmdb.org/t/p/original//${poster}`} alt="Error"/>
      </div>
  );
}

function Character(props) {
  const {char} = props;
  return(
    <div className='character'>
      <img className='image' src= {`http://image.tmdb.org/t/p/original//${char.profile}`} alt="Error"/>
      <h4 className='name'>{char.name}</h4>
      <span className='character-name'>{char.character}</span>
    </div>
  );
}

export default Movies;