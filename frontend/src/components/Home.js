import '../styles/Home.scss'
import {useState} from "react";

const Home = () => {

    const axios = require('axios')

    const [createPost, setCreatePost] = useState(false)
    const [content, setContent] = useState("")

    const submitPost = () => {

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
                <div className={"create_post"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                    <div>
                        <span onClick={() => setCreatePost(!createPost)}>What do you think about?</span>
                    </div>
                </div>
                <div className={"posts"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    Posts
                </div>
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
                        <button>Post</button>
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