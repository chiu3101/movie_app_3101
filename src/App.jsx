import React from "react";
import {useDebounce} from 'react-use';
import { useState, useEffect } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json", //data that we accept from the server
    Authorization: `Bearer ${API_KEY}`, //this verifies who has made the request
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  //Debounce the search term to prevent making too many API requests
  //by waiting for a specified delay (500ms in this case) after the user stops typing before updating the debounced search term. This helps to reduce the number of API calls and improve performance, especially when the user is typing quickly.
  useDebounce(
    () => 
      setDebouncedSearchTerm(searchTerm),
      500, // Debounce delay of 500ms
    [searchTerm]
  );

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');
    try {
      const endpoint = debouncedSearchTerm 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(debouncedSearchTerm)}`
      //encodeURIComponent is used to ensure that any special characters in the search term are properly encoded for use in a URL. This prevents issues with spaces and other characters that may not be valid in a URL.
      //shortly used so that the query is passed properly to the API endpoint, allowing for accurate search results based on the user's input. If the query is empty, it defaults to fetching popular movies.
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.results) {
        setMovies(data.results || []);
      } else {
        setErrorMessage('Failed to fetch movies');
        setMovies([]);
      }

      console.log(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);//when the component mounts, it will fetch movies based on the debounced search term. If the debounced search term is empty, it will fetch popular movies.
  }, [debouncedSearchTerm]);//this effect runs whenever the debouncedSearchTerm changes, allowing the app to fetch new movies based on the user's input.

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1 className="text-3xl font-bold underline">
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="text-white mt-[40px]">All Movies</h2>
          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
