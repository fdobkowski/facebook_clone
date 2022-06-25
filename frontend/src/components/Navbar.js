import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate()

    return (
        <nav>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/profile/5")}>Profile</button>
        </nav>
    )
}

export default Navbar