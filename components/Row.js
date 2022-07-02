import movieTrailer from 'movie-trailer';
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import instance from '../axios';

const baseUrl = 'https://image.tmdb.org/t/p/original/';
function Row({ title, fetchUrls, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const request = await instance.get(fetchUrls);
      setMovies(request.data.results);
    };
    fetchData();
  }, []);
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.name || '')
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);

          setTrailerUrl(urlParams.get('v'));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //   console.table(movies);
  const opts = {
    height: '390',
    width: '100vw',
    playerVars: {
      autoPlay: 1,
    },
  };
  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row_posters">
        {movies?.map((movie) => {
          return (
            <div className="" key={movie.id} onClick={() => handleClick(movie)}>
              <img
                className={` ${isLargeRow ? 'row__posterLarge' : 'row_poster'}`}
                src={`${baseUrl}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            </div>
          );
        })}
      </div>
      <YouTube videoId={trailerUrl} opt={opts} />
    </div>
  );
}

export default Row;
