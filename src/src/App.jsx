import React, { useEffect, useState } from 'react'
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers:{
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
  const[searchTerm, setSearchTerm] = useState('')
  const[errorMessage, setErrorMessage] = useState('');
  const[moviesList, setMovieList] = useState([]);
  const[isloading, setIsloading] = useState(false);
  const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);


  const fetchMovies = async (query = '') => {

    setIsloading(true);
    setErrorMessage('');
    try{
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      
      

      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
      }else{
      setMovieList(data.results || []);
      console.log(data);
      }

      

    } catch(error){
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
    finally{
      setIsloading(false);
    }
  }

  useEffect(()=> {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
        <img src="./hero.png" alt="Hero Banner" />
        <h1>Find the <span className="text-gradient">movies</span> you enjoy without hassle</h1>


        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px] text-center'>All Movies</h2>
          {isloading?(
            <Spinner/>
          ):errorMessage?(
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
            {moviesList.map((movie) => (
              <MovieCard key={movie.id} movie={movie}/>
            ))}
             </ul>

          )

          }
        </section>
      </div>

      
    </main>
  )
}

export default App
