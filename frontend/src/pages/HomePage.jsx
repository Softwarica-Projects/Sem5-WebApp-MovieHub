import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FeaturedMovie from "../components/FeaturedMovie"
import ReleasingSoon from "../components/ReleasingSoon"
import PopularMovies from '../components/PopularMovies';
import RecentlyAdded from '../components/RecentlyAdded';
import PublicLayout from '../layout/PublicLayout';
const HomePage = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/login');
    };
    return (
        <PublicLayout>
            <FeaturedMovie />
            <PopularMovies />
            <RecentlyAdded />
            <ReleasingSoon />
        </PublicLayout>
    )


    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">MovieHub</Navbar.Brand>
                    {token ? (<Nav className="ms-auto">
                        <Button
                            variant="outline-light"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </Button>
                    </Nav>) : (<Nav className="ms-auto">
                        <Button
                            variant="outline-light"
                            className="me-2"
                            onClick={() => navigate('/login')}
                        >
                            Normal Login
                        </Button>
                        <Button
                            variant="outline-light"
                            onClick={() => navigate('/admin/login')}
                        >
                            Admin Login
                        </Button>
                    </Nav>)}
                </Container>
            </Navbar>
            <Container className="mt-5 text-center">
                <h1>Welcome to MovieHub</h1>
                <p>Your one-stop destination for all things movies!</p>
            </Container>
        </>
    );
};

export default HomePage;