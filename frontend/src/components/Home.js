import '../styles/Home.scss'
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import CreatePost from "./CreatePost";

const Home = () => {

    const axios = require('axios')
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()

    const [createPost, setCreatePost] = useState(false)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (cookies['profile_id'] === undefined || cookies['profile_first_name'] === undefined || cookies['profile_last_name'] === undefined) {
            navigate('/login')
        }
    }, [])
    

    useEffect(() => {
        axios.get('http://localhost:5000/api/posts').then(response => {
            setPosts(response.data)
        }).catch(err => console.error(err))
    }, []);


    return (
        <div className={"home_container"}>
            <div className={"side_bar"} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }}>
                <button onClick={() => navigate(`/profile/${cookies['profile_id']}`)}>Profile</button>
                <button>Friends</button>
            </div>
            <div className={"main"}>
                <div className={"create_post"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                    <div>
                        <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {cookies['profile_first_name']}?</span>
                    </div>
                </div>
                <ul className={"posts"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    {posts.map(x => {
                        return (
                            <li key={x.id}>{x.content}</li>
                        )
                    })}
                </ul>
                <button onClick={() => navigate('/protected')}>Administration panel</button>
                {(createPost) ? <CreatePost visible={setCreatePost}/> : null }
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