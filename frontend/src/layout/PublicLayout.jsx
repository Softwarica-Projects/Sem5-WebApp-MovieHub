import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate("/");
  };

  return (
    <>
      <div className="flex item-center justify-between p-4 z-[100] w-full absolute">
        <Link to="/">
          <h1 className="text-cyan-600 text-4xl font-bold cursor-pointer">
            MOVIEHUB
          </h1>
        </Link>
        <div><Link to="/movie">
          <button className="text-[#FFFDE3] pr-6">Movies</button>
        </Link>
          <Link to="/favourites">
            <button className="text-[#FFFDE3] pr-6">My List</button>
          </Link>
          {token ? (
            <>
              <Link to="/profile">
                <button className="text-[#FFFDE3] pr-6">Account</button>
              </Link>

              <button
                onClick={handleLogout}
                className="text-[#FFFDE3] px-6 py-2 rounded cursor-pointer bg-cyan-600 "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="text-[#FFFDE3] pr-4">Login</button>
              </Link>
              <Link to="/register">
                <button className="text-[#FFFDE3] px-6 py-2 rounded cursor-pointer bg-cyan-600 ">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default PublicLayout;
