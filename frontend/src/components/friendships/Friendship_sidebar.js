import '../../styles/Friendship_sidebar.scss'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getFriendships} from "../../redux/reducers/profileReducer";
import {useNavigate} from "react-router-dom";

const Friendship_sidebar = ( { createPost, setCreatePost, id, socket }) => {

    const all_profiles = useSelector((state) => state.profiles.profiles)
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === id))
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getFriendships(id))
    }, [])

    const handleChat = (sender_id, receiver_id) => {
        if (socket) {
            socket.emit('join_chat', {
                sender_id: sender_id,
                receiver_id: receiver_id
            })
        }
    }

    return (
        <div className={"friends_list"} id={`post_${createPost}`} onClick={() => {
            if (createPost) setCreatePost(false)
        }}>
            {(profile && profile.friendships) ?
                <ul>
                    {profile.friendships.map((x, i) => {
                        return (
                            <li key={i}>
                                <img onClick={() => navigate(`/profile/${x.friend}`)} alt={'profile_picture'} src={require('../../assets/fb_profile_picture.png')} />
                                <span onClick={() => handleChat(id, x.friend)}>{all_profiles.find(y => y.id === x.friend).first_name} {all_profiles.find(y => y.id === x.friend).last_name}</span>
                            </li>
                        )
                    })}
                </ul> : 'You have no friends yet'}
        </div>
    )
}

export default Friendship_sidebar