import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieById, toggleFavMovie } from "../services/movieService";
import { IoMdPlay } from "react-icons/io";
import Youtube from "react-youtube";
import { AiFillStar } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import PublicLayout from "../layout/PublicLayout";
import { getYouTubeVideoId } from "../utils/youtubeVideoHelper";
import MovieTrailer from "../components/MovieTrailer";
import { getImageUrl } from '../utils/imageUtils';
import LoadingBar from "../components/LoadingBar";

const MovieDetail = () => {
    const role = localStorage.getItem("role");
    const [movie, setMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);
            getMovieById(id).then((response) => {
                setMovie(response);
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching movie:', error);
                setLoading(false);
            });
        }
    }, [id]);


    const onFavClick = async () => {
        try {
            setMovie({
                ...movie, isFavourite: !movie.isFavourite
            });
            await toggleFavMovie(id);

        } catch {
            setMovie({
                ...movie, isFavourite: !movie.isFavourite
            });
        }
    }

    if (loading) {
        return (
            <PublicLayout>
                <LoadingBar />
            </PublicLayout>
        );
    }

    if (!movie) {
        return (
            <PublicLayout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-white text-xl">Movie not found</p>
                </div></PublicLayout>
        );
    }

    return (<PublicLayout>
        <div className=" h-[90vh]">
            {showModal ? (
                <MovieTrailer trailerLink={movie.trailerLink} onClick={() => setShowModal(false)}>
                </MovieTrailer>
            ) : null}

            <div className="">
                <div className="absolute w-full h-[70vh] bg-gradient-to-t from-black ">
                    {" "}
                </div>
                {movie.trailerLink ? <Youtube
                    videoId={getYouTubeVideoId(movie.trailerLink)}
                    className="w-full h-[70vh] object-cover "
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            mute: 1,
                        },
                    }}
                /> :
                    <img
                        src={getImageUrl(movie.coverImage)}
                        alt={movie.title || "Movie poster"}
                        className="w-full h-[70vh] object-cover "
                    />}
            </div>
            <div className="flex justify-center ">
                <div className="flex flex-col items-center md:flex-row md:max-w-2xl lg:max-w-3xl absolute xl:max-w-4xl md:mt-[-300px] mt-[-200px] text-white ">
                    <div className="lg:w-[30%] h-auto md:h-[400px] w-[70%]">
                        <img
                            className="w-full h-full object-cover rounded-md"
                            src={getImageUrl(movie.coverImage)}
                            alt=""
                        />
                    </div>
                    <div className="float-left w-[70%] md:pl-12 ">
                        <p className="text-3xl md:text-5xl mb-3 mt-3 md:mt-0">
                            {movie.title}{" "}
                        </p>
                        <div className="flex flex-row items-center ">
                            <div className="flex flex-row justify-center items-center mr-5 pb-2 text-orange-400">
                                <AiFillStar className="text-3xl mr-2 text-orange" />
                                <p className="text-4xl ">
                                    {movie?.averageRating}{" "}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="grid grid-flow-col auto-cols-max gap-4 ">
                                    <p className="text-cyan-600 text-sm md:text-base">
                                        {new Date(movie?.releaseDate) <= new Date()
                                            ? `Released: ${movie?.releaseDate?.split("T")[0]}`
                                            : `Releasing on: ${movie?.releaseDate?.split("T")[0]}`}
                                    </p>
                                    <p className="text-cyan-600 text-sm md:text-base">
                                        {movie?.runtime} min
                                    </p>
                                </div>

                                <div className="grid grid-flow-col auto-cols-max gap-4 mb-3">
                                    <span className="text-sm  md:text-base">
                                        {movie.genre.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-8">{movie.description} </p>
                        <div className="flex flex-row items-center ">
                            {movie.movieLink && (
                                <button
                                    onClick={() => window.open(movie.movieLink, "_blank")}
                                    className="border bg-gray-300 text-black border-gray-300 py-2 px-5 flex flex-row items-center hover:bg-gray-400 mb-8 md:mb-0 mr-4"
                                >
                                    <IoMdPlay className="mr-3" />
                                    Play
                                </button>
                            )}
                            {movie.trailerLink && <button
                                onClick={() => setShowModal(true)}
                                className="border text-[#FFFDE3] text-base border-gray-300 py-2 px-5 flex flex-row items-center hover:bg-cyan-600 hover:border-cyan-600 mb-8 md:mb-0"
                            >
                                <IoMdPlay className="mr-3" />
                                Watch Trailer
                            </button>}
                            {role && <p onClick={onFavClick} className=" cursor-pointer">
                                {movie.isFavourite ? (
                                    <FaHeart className="text-pink-300 text-2xl ml-6 mb-8 md:mb-0" />
                                ) : (
                                    <FaRegHeart className="text-gray-300 text-2xl ml-6 mb-8 md:mb-0" />
                                )}
                            </p>}
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>

            {/* Cast Section */}
            {
                <div className=" py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-white text-3xl font-bold mb-8">Cast ({movie.cast.length})</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {movie.cast.map((member, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                                    <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-medium text-sm mb-1">{member.name}</h3>
                                    <p className="text-gray-400 text-xs">{member.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

            {
                <div className="py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="space-y-6">
                            {movie.ratings.map((rating, index) => (
                                <div key={index} className="bg-gray-700 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white font-bold">
                                                    {rating.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">
                                                    {rating.userId?.name || 'Anonymous User'}
                                                </h4>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, starIndex) => (
                                                        <AiFillStar
                                                            key={starIndex}
                                                            className={`text-sm ${starIndex < rating.rating
                                                                    ? 'text-orange-400'
                                                                    : 'text-gray-400'
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="text-gray-300 text-sm ml-2">
                                                        {rating.rating}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {rating.review && (
                                        <p className="text-gray-300 leading-relaxed">{rating.review}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    </PublicLayout >
    );
};

export default MovieDetail;
