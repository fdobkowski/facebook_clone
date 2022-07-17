import '../styles/Profile.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import CreatePost from "./CreatePost";
import {useSelector} from "react-redux";

const Profile = () => {

    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()
    const [createPost, setCreatePost] = useState(false)

    const { id } = useParams()
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === id))
    const profile_posts = useSelector((state) => state.posts.posts.filter(x => x.profile_id === id))

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    return (
        <div className={'profile_container'}>
            <div className={'profile_header'} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }}>
                <img alt={'profile img'} src={require('../assets/fb_profile_picture.png')}/>
                <span>{profile.first_name} {profile.last_name}</span>
            </div>
            {(profile) ?
            <div className={'profile_body'}>
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
                        <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                        <div>
                            <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {cookies['profile_first_name']}?</span>
                        </div>
                    </div> : null}
                    {(profile_posts.length !== 0 ?
                        <ul>
                            {profile_posts.reverse().map(x => {
                            return (
                                <li key={x.id} className={'profile_post_container'}>
                                    <div className={'post_data'}>
                                        <span>
                                            <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
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
                : null}
        </div>
    )
}

export default Profile