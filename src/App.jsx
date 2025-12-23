import React from "react";
import { useState , useEffect} from "react";
import Search from "./components/Search.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3/discover/movie";

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

  const fetchMovies = async (url) => {
    try {
      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }
  }

  useEffect(() => {
    console.log(searchTerm);
  }, []);

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
          <h2>All Movies</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;
