import '../../styles/Navbar.scss'
import homeLogo from '../../assets/home_icon.svg'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useKeycloak} from "@react-keycloak/web";
import {useCallback, useEffect} from "react";
import Searchbar from "./Searchbar";

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { keycloak } = useKeycloak()

    const handleLogout = useCallback(() => {
        if (keycloak.authenticated) keycloak.logout()
    }, [keycloak])


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
                <img alt={'home'} src={homeLogo} onClick={() => navigate("/")} />
                <Searchbar />
                <div>
                    <button onClick={() => (cookies['profile_id']) ? navigate(`/profile/${cookies['profile_id']}`) : null}>Profile</button>
                    <button onClick={() => {
                        removeCookies('profile_id')
                        removeCookies('profile_first_name')
                        removeCookies('profile_last_name')
                        navigate(0)
                        handleLogout()
                    }}>Logout</button>
                </div>

            </nav> : null }
        </div>
    )
}

export default Navbar