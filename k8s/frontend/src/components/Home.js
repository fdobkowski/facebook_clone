import '../styles/Home.scss'
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const Home = () => {

    const axios = require('axios')
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()

    const [createPost, setCreatePost] = useState(false)
    const [users, setUsers] = useState([])


    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])


    const get_users = () => {
        axios.get('http://localhost:31100/api/users/all').then((response) => {
            setUsers(response.data)
        }).catch(error => console.error(error))
    }


    return (
        <div className={"home_container"}>
            <div className={"side_bar"} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }}>
                <button>Profile</button>
                <button>Friends</button>
            </div>
            <div className={"main"}>
                <ul className={"posts"}>
                    {users.map(x => {
                        return (
                            <li key={x.id}>
                                <p>Id: ${x.id}</p>
                                <p>Email: ${x.email}</p>
                                <p>Mobile number: ${x.number}</p>
                                <p>Password: ${x.password}</p>
                                <div className="li_border"></div>
                            </li>
                        )
                    })}
                </ul>
                <button onClick={() => get_users()}>Get users</button>
            </div>
            <div className={"friends_list"} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }}>
                Friends List
            </div>
        </div>
    )
}

export default Home