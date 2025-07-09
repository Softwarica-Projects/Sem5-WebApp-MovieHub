import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFeaturedMovies } from "../services/movieService";

const FeaturedMovie = () => {
  const [movies, setMovies] = useState([]);
  const movie = movies[Math.floor(Math.random() * movies.length)];

  useEffect(() => {
    getFeaturedMovies().then((response) => {
      setMovies(response);
    });
  }, []);

  const navigate = useNavigate();


  const ReadMore = (text) => {
    const over = JSON.stringify(text);
    const overview = over.replace(/[^\w\s]/g, "").replace(/(^\s+|\s+$)/g, "").replace(/\s+/g, " ").replace("children", "");
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => { setIsReadMore(!isReadMore) };

    return (
      <p>
        {isReadMore ? overview.slice(0, 150) : overview}
        {overview.length > 150 &&
          <span onClick={toggleReadMore} className="text-gray-500 cursor-pointer">
            {isReadMore ? '...read more' : ' ...show less'}
          </span>
        }
      </p>
    )
  }

  const handleClick = () => {
    navigate(`/${props.genre}/${movie.id}`)
  }


  return (
    <div className="w-full h-[50vh] md:h-[500px] text-[#FFFDE3]">
      <div className="w-full h-full">
        <div className="absolute w-full h-[50vh] md:h-[500px] bg-gradient-to-r from-black">
          {" "}
        </div>
        <img
          className="w-full h-[70vh] md:h-full object-cover"
          src={movie?.coverImage}
          alt=""
        />
        <div className="absolute w-full top-[30%] p-4 md:p-16">
          <h1 className="text-2xl md:text-5xl font-bold">{movie?.title} </h1>
          <div className="my-4">
            <button onClick={handleClick} className=" border bg-gray-300 text-black border-gray-300 py-2 px-5" >
              More Detail
            </button>
            <button className="border text-[#FFFDE3] border-gray-300 py-2 px-5 ml-4 " onClick={() => {
              window.open(movie.trailerLink, "_blank");
            }}>
              Trailer
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Released On: {movie?.releaseDate?.split("T")[0]}{" "}
          </p>

          <p className="w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] text-gray-200 text-sm md:text-base mt-2">
            <ReadMore>
              {movie?.description}
            </ReadMore>
          </p>



        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;
