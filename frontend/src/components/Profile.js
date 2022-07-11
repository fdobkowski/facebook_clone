import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";

const Profile = () => {

    const { id } = useParams()
    const [cookies, setCookies] = useCookies(['user'])
    const navigate = useNavigate()
    const axios = require('axios')
    const [profileData, setProfileData] = useState({})

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
            <div className={'profile_header'}>
                <img alt={'profile img'} src={require('../assets/fb_profile_picture.png')}/>
                <span>{cookies['profile_first_name']} {cookies['profile_last_name']}</span>
            </div>
            <div>
                <div className={'profile_data'}>
                    <span>First name: {profileData.first_name}</span>
                    <span>Last name: {profileData.last_name}</span>
                    <span>Birthday: {profileData.birthday}</span>
                    <span>Gender: {(profileData.gender === 'Custom') ?
                        (profileData.custom_gender ? profileData.custom_gender : profileData.gender) : profileData.gender}</span>
                    <span>Pronoun: {profileData.pronoun}</span>
                </div>
                <ul className={'profile_posts'}>
                    {(profileData.posts ? profileData.posts.map(x => {
                        return (
                            <li key={x.id} className={'profile_post_container'}>
                                <div>
                                    <span className={'post_data'}>{profileData.first_name} {profileData.last_name}</span>
                                    <span className={'post_date'}>{x.date}</span>
                                </div>
                                <div>
                                    {x.content}
                                </div>
                            </li>
                        )
                    }) : null)}
                </ul>
            </div>
        </div>
    )
}

export default Profile