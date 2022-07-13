import '../styles/Profile.scss'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import CreatePost from "./CreatePost";

const Profile = () => {

    const { id } = useParams()
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()
    const axios = require('axios')
    const [profileData, setProfileData] = useState({})
    const [createPost, setCreatePost] = useState(false)

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/profiles/${cookies['profile_id']}`)
            .then(async response => {
                const data = response.data
                axios.get(`http://localhost:5000/api/posts/profile/${cookies['profile_id']}`)
                    .then(response => {
                        data.posts = response.data
                        setProfileData(data)
                    }).catch(err => console.error(err))
            }).catch(err => console.error(err))
    }, []);

    useEffect(() => {
        console.log(profileData)
    }, [profileData])


    return (
        <div className={'profile_container'}>
            <div className={'profile_header'} id={`post_${createPost}`} onClick={() => {
                if (createPost) setCreatePost(false)
            }}>
                <img alt={'profile img'} src={require('../assets/fb_profile_picture.png')}/>
                <span>{cookies['profile_first_name']} {cookies['profile_last_name']}</span>
            </div>
            <div className={'profile_body'}>
                <div className={'profile_data'} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <span>First name: {profileData.first_name}</span>
                    <span>Last name: {profileData.last_name}</span>
                    <span>Birthday: {new Date(profileData.birthday).toLocaleDateString()}</span>
                    <span>Gender: {(profileData.gender === 'Custom') ?
                        (profileData.custom_gender ? profileData.custom_gender : profileData.gender) : profileData.gender}</span>
                    <span>Pronoun: {profileData.pronoun}</span>
                </div>
                <div className={'profile_posts'} id={`post_${createPost}`} onClick={() => {
                    if (createPost) setCreatePost(false)
                }}>
                    <div className={"create_post"}>
                        <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                        <div>
                            <span onClick={() => setCreatePost(!createPost)}>What's on your mind, {cookies['profile_first_name']}?</span>
                        </div>
                    </div>
                    <ul>
                        {(profileData.posts ? profileData.posts.reverse().map(x => {
                            return (
                                <li key={x.id} className={'profile_post_container'}>
                                    <div className={'post_data'}>
                                        <span>
                                            <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                                            {profileData.first_name} {profileData.last_name}
                                        </span>
                                        <span>{new Date(x.date).toLocaleString()}</span>
                                    </div>
                                    <div className={'post_content'}>
                                        {x.content}
                                    </div>
                                </li>
                            )
                        }) : null)}
                    </ul>
                </div>
                {(createPost) ? <CreatePost visible={setCreatePost}/> : null }
            </div>
        </div>
    )
}

export default Profile