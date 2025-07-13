import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { getPopularMovies } from "../services/movieService";

import MovieRow from "./MovieRow";

const LoadingBar = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingBar;
