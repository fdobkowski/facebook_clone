import '../styles/CreatePost.scss'
import axios from "axios";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import { v4 as uuid } from 'uuid'
import {useSelector} from "react-redux";

const CreatePost = ({ visible }) => {

    const [content, setContent] = useState("")
    const user = useSelector((state) => state.profiles.main_profile)
    const navigate = useNavigate()
    const picture = useSelector((state) => state.profiles.profiles.find(x => x.id === user.id).image)

    const submitPost = async () => {
        const date = new Date()
        await axios.post('http://localhost:5000/api/posts', {
            id: uuid(),
            profile_id: user.id,
            content: content,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }).then(() => {
            alert("Post added")
            navigate(0)
        }).catch(error => console.error(error))
    }

    return (
        <div className={"create_post_container"}>
            <div className={"post_header"}>
                <div className={"post_utils"}>
                    <span>Create post</span>
                    <img alt={'close'} src={require('../assets/close.png')} onClick={() => visible(false)} />
                </div>
                <div className={"post_info"}>
                    <img alt={'profile_picture'} src={picture}/>
                    <span>{user.first_name} {user.last_name}</span>
                </div>
            </div>
            <div className={"post_container"}>
                <textarea placeholder={`What's on your mind, ${user.first_name}?`} onChange={(event) => setContent(event.target.value)}/>
            </div>
            <div className={"post_button"}>
                <button onClick={() => submitPost()}>Post</button>
            </div>
        </div>
    )
}

export default CreatePost