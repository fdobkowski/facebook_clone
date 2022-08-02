import '../styles/Home.scss'
import '../styles/Posts.scss'
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import CreatePost from "./CreatePost";
import {useDispatch, useSelector} from "react-redux";
import Friendship_sidebar from "./friendships/Friendship_sidebar";
import {getFriendships} from "../redux/reducers/profileReducer";

const Home = ( { socket } ) => {

    const axios = require('axios')
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()

    const [createPost, setCreatePost] = useState(false)
    const all_profiles = useSelector((state) => state.profiles.profiles)
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === cookies['profile_id']))
    const posts = useSelector((state) => [...state.posts.posts.filter(x => {
        return x.profile_id === cookies['profile_id'] || ((profile && profile.friendships) && [...profile.friendships.map(y =>  y.friend)].includes(x.profile_id))
    })])
    const dispatch = useDispatch()

    useEffect(() => {
        if (cookies['profile_id'] === undefined || cookies['profile_first_name'] === undefined || cookies['profile_last_name'] === undefined) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        console.log(posts)
    }, [posts])


    useEffect(() => {
        dispatch(getFriendships(cookies['profile_id']))
    }, [])


    return (
        <div className={"home_container"}>
            <div className={"side_bar"} id={`post_${createPost}`}>
                <button onClick={() => navigate(`/profile/${cookies['profile_id']}`)}>Profile</button>
                <button onClick={() => navigate(`/profile/${cookies['profile_id']}/friends`)}>Friends</button>
            </div>
            <div className={"main"}>
                {(profile) ?
                <div className={"create_post"} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <img alt={'profile_picture'} src={profile.image}/>
                    <div>
                        <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {cookies['profile_first_name']}?</span>
                    </div>
                </div> : null }
                {(posts.length !== 0 ?
                    <ul className={'posts'} id={`post_${createPost}`} onClick={() => {
                        if (createPost) setCreatePost(false)
                    }}>
                        {(posts) ? posts.reverse().map(x => {
                            return (
                                <li key={x.id} className={'profile_post_container'}>
                                    <div className={'post_data'}>
                                        <span>
                                            <img alt={'profile_picture'} src={profile.image}/>
                                            {all_profiles.find(y => y.id === x.profile_id).first_name} {all_profiles.find(y => y.id === x.profile_id).last_name}
                                        </span>
                                        <span>{new Date(x.date).toLocaleString()}</span>
                                    </div>
                                    <div className={'post_content'}>
                                        {x.content}
                                    </div>
                                </li>
                            )
                        }) : null}
                    </ul> : <span className={'empty_posts'}>Such empty</span>)}
                <button onClick={() => navigate('/protected')}>Administration panel</button>
                {(createPost) ? <CreatePost visible={setCreatePost}/> : null }
            </div>
           <Friendship_sidebar createPost={createPost} setCreatePost={setCreatePost} id={cookies['profile_id']} socket={socket}/>
        </div>
    )
}

export default Home