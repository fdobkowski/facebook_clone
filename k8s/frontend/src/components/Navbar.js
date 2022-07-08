import '../styles/Navbar.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useEffect} from "react";

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()


    const [cookies, setCookies, removeCookies] = useCookies(['user'])

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    return (
        <div>
        {(location.pathname !== '/login') ?
            <nav className={"navbar_container"}>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => {
                    removeCookies('profile_id')
                    navigate(0)
                }}>Logout</button>
            </nav> : null }
        </div>
    )
}

export default Navbar