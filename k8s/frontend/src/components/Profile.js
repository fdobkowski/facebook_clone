import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useCookies} from "react-cookie";

const Profile = () => {

    const { id } = useParams()
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    return (
        <div>
            Profile {id}
        </div>
    )
}

export default Profile