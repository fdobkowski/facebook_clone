import '../styles/Navbar.scss'
import {useLocation, useNavigate} from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div>
        {(location.pathname !== '/login') ?
            <nav className={"navbar_container"}>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/profile/5")}>Profile</button>
            </nav> : null }
        </div>
    )
}

export default Navbar