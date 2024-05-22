import { useEffect, useState } from "react";

const KEY = "c128eb57";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!response.ok)
            throw new Error("Something went wrong while fetching movies");
          const data = await response.json();
          if (data.Response === "False")
            throw new Error("Something went wrong while fetching movies");
          setMovies(data.Search);
          setError("");
          // setSelectedId(data.Search.imdbID);
        } catch (error) {
          if (error.name === "AbortError") {
            setError(error.message);
          }
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
      return () => {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
