import { useEffect, useState } from "react";

import Movie from "../components/Movie";
import { getFavMovies } from "../services/movieService";
import PublicLayout from "../layout/PublicLayout";
import LoadingBar from "../components/LoadingBar";

const FavMoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                await loadMovies();
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const loadMovies = async () => {
        const response = await getFavMovies();
        setMovies(response);
    };
    return (
        <PublicLayout>
            <div className="pt-20">
                <div className="items-center ml-2 group">
                    {loading ? (
                    <LoadingBar />
                    ) : movies.length > 0 ? (
                        movies.map((item, index) => {
                            return (
                                <Movie key={`_${index}`} movie={item} showRating={true}></Movie>
                            );
                        })
                    ) : (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-[#FFFDE3] text-lg">No movies found</div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default FavMoviePage;
