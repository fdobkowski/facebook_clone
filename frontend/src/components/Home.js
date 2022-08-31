import '../styles/Home.scss'
import '../styles/Posts.scss'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import CreatePost from "./CreatePost";
import {useDispatch, useSelector} from "react-redux";
import Friendship_sidebar from "./friendships/Friendship_sidebar";
import {getFriendships} from "../redux/reducers/profileReducer";

const Home = ( { socket } ) => {

    const navigate = useNavigate()
    const user = useSelector((state) => state.profiles.main_profile)
    const [createPost, setCreatePost] = useState(false)
    const all_profiles = useSelector((state) => state.profiles.profiles)
    const posts = useSelector((state) => [...state.posts.posts.filter(x => {
        return x.profile_id === user.id || ((user && user.friendships) && [...user.friendships.map(y =>  y.friend)].includes(x.profile_id))
    })])
    const dispatch = useDispatch()

    useEffect(() => {
        if (user && !user.friendships) dispatch(getFriendships(user.id))
    }, [user])

    return (
        <div className={"home_container"}>
            <div className={"side_bar"}>
                <button onClick={() => navigate(`/profile/${user.id}`)}>Profile</button>
                <button onClick={() => navigate(`/profile/${user.id}/friends`)}>Friends</button>
            </div>
            <div className={"main"}>
                {(user) ?
                <div className={"create_post"}>
                    <img alt={'profile_picture'} src={user.image}/>
                    <div>
                        <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {user.first_name}?</span>
                    </div>
                </div> : null }
                {(user && posts.length !== 0 ?
                    <ul className={'posts'} id={`post_${createPost}`}>
                        {(posts) ? posts.reverse().map(x => {
                            return (
                                <li key={x.id} className={'profile_post_container'}>
                                    <div className={'post_data'}>
                                        <span onClick={() => (x.profile_id !== user.id) ? navigate(`/profile/${x.profile_id}`) : null}
                                        id={(x.profile_id !== user.id) ? 'foreign_post' : 'own_post'}>
                                            <img alt={'profile_picture'} src={all_profiles.find(y => y.id === x.profile_id).image}/>
                                            {all_profiles.find(y => y.id === x.profile_id).first_name} {all_profiles.find(y => y.id === x.profile_id).last_name}
                                        </span>
                                        <span>{new Date(x.date).toLocaleString(undefined, {timeZone: 'UTC'})}</span>
                                    </div>
                                    <div className={'post_content'}>
                                        {x.content}
                                    </div>
                                </li>
                            )
                        }) : null}
                    </ul> : <span className={'empty_posts'}>Such empty</span>)}
                {(createPost) ?
                <div>
                    <div className={'click_filter'} onClick={() => setCreatePost(false)}></div>
                    <CreatePost visible={setCreatePost}/>
                </div> : null }
            </div>
            {(user) ? <Friendship_sidebar id={user.id} socket={socket}/> : null}
        </div>
    )
}

export default Home