import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';


const Movie = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // navigate(`/${props.genre}/${props.item.id}`)
  }
  return (
    <div className="w-[180px] sm:w-[250px] md:w-[320px] lg:w-[320px] xl:w-[280px] h-[270px] sm:h-[375px] md:h-[480px] lg:h-[480px] xl:h-[420px] inline-block cursor-pointer relative p-4 z-0">
      <img
        className="w-full h-full hover:opacity-50 rounded object-cover"
        src={movie.coverImage}
        alt=""
        onClick={handleClick}
      />
      <div onClick={handleClick} className="absolute top-0 left-0 w-full h-full bg-black/40 hover:opacity-100 text-white px-5">
        <div className="flex flex-row justify-center items-center absolute top-8 right-8 text-orange-400">
          <AiFillStar />
          <p className="text-xs md:text-base font-bold">{movie.averageRating} </p>
        </div>
        <div className="flex flex-row justify-center items-center absolute bottom-8 left-8 right-8">
          <p className="text-base md:text-lg font-medium truncate">{movie.title}</p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
