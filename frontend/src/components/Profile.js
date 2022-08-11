import '../styles/Profile.scss'
import '../styles/Posts.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import CreatePost from "./CreatePost";
import {useSelector} from "react-redux";
import ProfilePicture from "./ProfilePicture";
import ProfileDataForm from "./ProfileDataForm";
import axios from 'axios'

const Profile = ( { socket } ) => {

    const navigate = useNavigate()
    const [createPost, setCreatePost] = useState(false)
    const [addProfilePicture, setAddProfilePicture] = useState(false)

    const { id } = useParams()
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === id))
    const user = useSelector((state) => state.profiles.main_profile)
    const profile_posts = useSelector((state) => state.posts.posts.filter(x => x.profile_id === id))

    const [edit, setEdit] = useState(false)

    const handleChat = () => {
        if (socket) {
            socket.emit('join_chat', {
                sender_id: user.id,
                receiver_id: id
            })
        }
    }

    const handleDelete = async (id) => {
        await axios.delete('http://localhost:5000/api/friendships', {
            data: {
                receiver_id: user.id,
                sender_id: id
            }
        }).then(() => {
            alert(`${profile.first_name} ${profile.last_name} isn't your friend anymore`)
            navigate(0)
        }).catch(err => console.error(err))
    }


    return (
        (profile && user) ?
        <div className={'profile_container'}>
            <div className={'profile_header'}>
                <div className={'profile_img_container'} id={(id === user.id) ? 'users_profile_picture' : null}>
                    <img alt={'profile img'} src={profile.image} onClick={() => {
                        if (id === user.id) setAddProfilePicture(true);
                    }} id={'profile_img'} style={((id === user.id)) ? {cursor: "pointer"} : null}/>
                    {(id === user.id) ? <p className={'profile_picture_edit'}
                    onClick={() => setAddProfilePicture(true)}>Edit profile picture</p> : null}
                </div>
                <div className={'profile_header_data'}>
                    <div>
                        <span>{profile.first_name} {profile.last_name}</span>
                        {(user.friendships && user.friendships.map(x => x.friend).includes(id)) ?
                        <img alt={'friend'} src={require('../assets/added.png')}/> : null}
                    </div>
                    {(id !== user.id && user && user.friendships && user.friendships.map(y => {
                        return y.friend
                    }).includes(id)) ?
                    <div className={'profile_header_buttons'}>
                        <button onClick={handleChat}>Send message</button>
                        <img onClick={() => handleDelete(id)} alt={'delete'} src={require('../assets/delete-account.png')}/>
                    </div> : null }
                </div>

            </div>
            <div className={'profile_body'}>
                <div className={'profile_sidebar'}>
                    <div className={'profile_data'}>
                        <span>First name: {profile.first_name}</span>
                        <span>Last name: {profile.last_name}</span>
                        <span>Birthday: {new Date(profile.birthday).toLocaleDateString()}</span>
                        <span>Gender: {(profile.gender === 'Custom') ?
                            (profile.custom_gender ? profile.custom_gender : profile.gender) : profile.gender}</span>
                        <span>Pronoun: {profile.pronoun}</span>
                    </div>
                    {(id === user.id) ?
                        <div className={'profile_buttons'}>
                            <button onClick={() => setEdit(true)}>Edit data</button>
                            <button
                                onClick={() => navigate(`/profile/${user.id}/friends`)}>
                                Friends
                            </button>
                        </div> : null}
                </div>
                <div className={'profile_posts'}>
                    {(id === user.id) ?
                    <div className={"create_post"}>
                        <img alt={'profile_picture'} src={profile.image}/>
                        <div>
                            <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {user.first_name}?</span>
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
                {(createPost) ?
                    <div>
                        <div className={'click_filter'} onClick={() => setCreatePost(false)}></div>
                        <CreatePost visible={setCreatePost}/>
                    </div> : null }
            </div>
            {(addProfilePicture) ?
                <div>
                    <div className={'click_filter'} onClick={() => setAddProfilePicture(false)}></div>
                    <ProfilePicture profile={profile} setAddProfilePicture={setAddProfilePicture}/>
                </div> : null}
            {(edit) ? <ProfileDataForm data={profile} setEdit={setEdit}/> : null}
        </div> : null
    )
}

export default Profile