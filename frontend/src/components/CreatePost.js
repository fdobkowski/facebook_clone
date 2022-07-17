import '../styles/CreatePost.scss'
import axios from "axios";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'

const CreatePost = ({ visible }) => {

    const [content, setContent] = useState("")
    const [cookies, setCookies, removeCookies] = useCookies()
    const navigate = useNavigate()

    const submitPost = async () => {
        const date = new Date()
        await axios.post('http://localhost:5000/api/posts', {
            id: uuidv4(),
            profile_id: cookies['profile_id'],
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
                    <button onClick={() => visible(false)}>X</button>
                </div>
                <div className={"post_info"}>
                    <img alt={'profile_picture'} src={require('../assets/fb_profile_picture.png')}/>
                    <span>{cookies['profile_first_name']} {cookies['profile_last_name']}</span>
                </div>
            </div>
            <div className={"post_container"}>
                <textarea placeholder={`What's on your mind, ${cookies['profile_first_name']}?`} onChange={(event) => setContent(event.target.value)}/>
            </div>
            <div className={"post_button"}>
                <button onClick={() => submitPost()}>Post</button>
            </div>
        </div>
    )
}

export default CreatePost