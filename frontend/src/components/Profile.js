import '../styles/Profile.scss'
import '../styles/Posts.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import CreatePost from "./CreatePost";
import {useSelector} from "react-redux";
import ProfilePicture from "./ProfilePicture";

const Profile = ( { socket } ) => {

    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()
    const [createPost, setCreatePost] = useState(false)
    const [addProfilePicture, setAddProfilePicture] = useState(false)

    const { id } = useParams()
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === id))
    const profile_posts = useSelector((state) => state.posts.posts.filter(x => x.profile_id === id))

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    const handleChat = () => {
        if (socket) {
            socket.emit('join_chat', {
                sender_id: cookies['profile_id'],
                receiver_id: id
            })
        }
    }

    return (
        (profile) ?
        <div className={'profile_container'}>
            <div className={'profile_header'} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }} style={(addProfilePicture) ? {filter: `blur(5px)`} : null}>
                <div className={'profile_img_container'} id={(id === cookies['profile_id']) ? 'users_profile_picture' : null}>
                    <img alt={'profile img'} src={profile.image} onClick={() => {
                        if (id === cookies['profile_id']) setAddProfilePicture(true);
                    }} id={'profile_img'} style={((id === cookies['profile_id'])) ? {cursor: "pointer"} : null}/>
                    {(id === cookies['profile_id']) ? <p className={'profile_picture_edit'}
                    onClick={() => setAddProfilePicture(true)}>Edit profile picture</p> : null}
                </div>
                <div className={'profile_header_data'}>
                    <span>{profile.first_name} {profile.last_name}</span>
                    {(id !== cookies['profile_id']) ?
                    <button onClick={handleChat}>Send message</button> : null }
                </div>

            </div>
            <div className={'profile_body'} style={(addProfilePicture) ? {filter: `blur(5px)`} : null}>
                <div className={'profile_data'} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <span>First name: {profile.first_name}</span>
                    <span>Last name: {profile.last_name}</span>
                    <span>Birthday: {new Date(profile.birthday).toLocaleDateString()}</span>
                    <span>Gender: {(profile.gender === 'Custom') ?
                        (profile.custom_gender ? profile.custom_gender : profile.gender) : profile.gender}</span>
                    <span>Pronoun: {profile.pronoun}</span>
                </div>
                <div className={'profile_posts'} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    {(id === cookies['profile_id']) ?
                    <div className={"create_post"}>
                        <img alt={'profile_picture'} src={profile.image}/>
                        <div>
                            <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {cookies['profile_first_name']}?</span>
                        </div>
                    </div> : null}
                    {(profile_posts.length !== 0 ?
                        <ul className={'posts'}>
                            {profile_posts.reverse().map(x => {
                            return (
                                <li key={x.id} className={'profile_post_container'}>
                                    <div className={'post_data'}>
                                        <span>
                                            <img alt={'profile_picture'} src={profile.image}/>
                                            {profile.first_name} {profile.last_name}
                                        </span>
                                        <span>{new Date(x.date).toLocaleString()}</span>
                                    </div>
                                    <div className={'post_content'}>
                                        {x.content}
                                    </div>
                                </li>
                            )
                        })}
                        </ul> : <span className={'empty_posts'}>Such empty</span>)}
                </div>
                {(createPost) ? <CreatePost visible={setCreatePost}/> : null }
            </div>
            {(addProfilePicture) ? <ProfilePicture profile={profile} setAddProfilePicture={setAddProfilePicture}/> : null}
        </div> : null
    )
}

export default Profile