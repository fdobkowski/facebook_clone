import '../styles/Home.scss'
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'

const Home = () => {

    const axios = require('axios')
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()

    const [createPost, setCreatePost] = useState(false)
    const [content, setContent] = useState("")
    const [posts, setPosts] = useState([])

    const submitPost = async () => {
        await axios.post('http://localhost:5000/api/posts', {
            id: uuidv4(),
            profile_id: cookies['profile_id'],
            content: content,
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDay()}`
        }).then(response => {
            alert("Post added")
            setCreatePost(false)
        }).catch(error => console.error(error))
    }

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
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
                <button>Profile</button>
                <button>Friends</button>
            </div>
            <div className={"main"}>
                <div className={"create_post"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                    <div>
                        <span onClick={() => setCreatePost(!createPost)}>What do you think about?</span>
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
                <button>Show post details</button>
                {(createPost) ?
                <div className={"create_post_container"}>
                    <div className={"post_header"}>
                        <div className={"post_utils"}>
                            <span>Create post</span>
                            <button onClick={() => setCreatePost(false)}>X</button>
                        </div>
                        <div className={"post_info"}>
                            <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                            <span>First_name Last_name</span>
                        </div>
                    </div>
                    <div className={"post_container"}>
                        <textarea placeholder={"What do you think about?"} onChange={(event) => setContent(event.target.value)}/>
                    </div>
                    <div className={"post_button"}>
                        <button onClick={() => submitPost()}>Post</button>
                    </div>
                </div> : null }
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