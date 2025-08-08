import React, { useEffect } from "react";

import { useMovies } from "../../hooks";

import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";


let currentPageNo = 0;

export default function Movies() {

  const {
    fetchMovies,
    movies: newMovies,
    fetchPrevPage,
    fetchNextPage,
  } = useMovies();

  
  const handleUIUpdate = () => {
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);
  if (!newMovies || newMovies.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-3xl font-semibold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400">
          No movies listed yet 🎬
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-3 p-5">
        
        {newMovies.map((movie) => {
        
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}

        <NextAndPrevButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>

    </>
  );
}
