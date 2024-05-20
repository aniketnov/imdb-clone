import { useEffect, useState } from "react";
import StarRating from "./StarRating.js";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c128eb57";
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovies(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!response.ok)
            throw new Error("Something went wrong while fetching movies");
          const data = await response.json();
          if (data.Response === "False")
            throw new Error("Something went wrong while fetching movies");
          setMovies(data.Search);
          // setSelectedId(data.Search.imdbID);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Searchbar query={query} setQuery={setQuery} />
        <NumMovies movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList
              movies={movies}
              onSelectedMovies={handleSelectedMovies}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MoviesDetails
              selectedId={selectedId}
              onCloseMovies={handleCloseMovie}
            />
          ) : (
            <>
              <WatchedSummry watched={watched} />
              <MoviesWatchList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader">
      <p>Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <p>{message}</p>
    </div>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Searchbar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumMovies({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectedMovies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies
          movie={movie}
          key={movie.imdbID}
          onSelectedMovies={onSelectedMovies}
        />
      ))}
    </ul>
  );
}

function Movies({ movie, onSelectedMovies }) {
  return (
    <li onClick={() => onSelectedMovies(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function MoviesWatchBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && <></>}
//     </div>
//   );
// }

function MoviesDetails({ selectedId, onCloseMovies }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    Actors,
    Awards,
    BoxOffice,
    Country,
    Director,
    Genre,
    Language,
    Plot,
    Poster,
    Rated,
    Released,
    Runtime,
    Title,
    imdbRating,
    imdbVotes,
    Writer,
  } = movie;
  useEffect(
    function () {
      async function moviesDetails() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          const data = await response.json();
          if (data.Response === "False")
            throw new Error("Something went wrong while fetching movies");
          setMovie(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      moviesDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovies}>
              &times;
            </button>
            <img src={Poster} alt={Title} />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} 🎞 {Runtime}
              </p>
              <p>{Genre}</p>

              <p>
                <span>⭐{imdbRating} IMDB Rating</span>
              </p>
              <p>
                <span>Country : {Country}</span>
              </p>
              <p>
                <span>Language : {Language}</span>
              </p>
              <p>
                <span>BoxOffice : {BoxOffice}</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxrating={10} size={32} />
            </div>

            <p>
              <em>{Plot}</em>
            </p>
            <p>
              <em>Actors : {Actors}</em>
            </p>
            <p>
              <em>
                Director : {Director} , Writer : {Writer}
              </em>
            </p>
            <p>
              <em>
                Awards : {Awards} , imdbVotes : {imdbVotes} , Rated : {Rated}
              </em>
            </p>
          </section>
        </>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function WatchedSummry({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function MoviesWatchList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovies movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovies({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
