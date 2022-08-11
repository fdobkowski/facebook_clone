import '../styles/ProfilePicture.scss'
import {useRef, useState} from "react";
import { Buffer } from 'buffer'
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {getProfiles} from "../redux/reducers/profileReducer";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { bucket } from "../S3";

window.Buffer = window.Buffer || Buffer

const ProfilePicture = ({ profile, setAddProfilePicture } ) => {

    const [file, setFile] = useState(null)
    const user = useSelector((state) => state.profiles.main_profile)
    const dispatch = useDispatch()
    const [temporaryImage, setTemporaryImage] = useState(profile.image)
    const navigate = useNavigate()
    const imageRef = useRef(null)

    const handleUpload = async () => {
        if (file) {
            if (file.size > 100000) alert('Image size is too large')
            else {

                const params = {
                    Body: file,
                    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                    Key: user.id,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }

                await bucket.putObject(params).promise().then(async () => {
                        await axios.patch(`http://localhost:5000/api/profiles/${user.id}`, {
                            url: `${process.env.REACT_APP_AWS_IMAGE_URL}/${user.id}`
                        })
                            .then(() => {
                                dispatch(getProfiles)
                                navigate(0)
                            }).catch(err => console.error(err))
                }).catch(err => console.error(err))
            }
        }
    }

    const imageChange = (e) => {
        setFile(e.target.files[0])

        const objectUrl = URL.createObjectURL(e.target.files[0])
        setTemporaryImage(objectUrl)
    }

    return (
        <div className={'profile_picture_container'} ref={imageRef}>
            <div className={'profile_picture_header'}>
                <h1>Change profile picture</h1>
                <img alt={'exit'} src={require('../assets/close.png')} onClick={() => setAddProfilePicture(false)}/>
            </div>
            <img alt={'picture'} src={temporaryImage} />
            <div>
                <input type={'file'} name={'image'} accept={'image/png,image/jpeg,image/bmp,image/gif,image/tiff'} onChange={e => imageChange(e)}/>
                <button type={"submit"} onClick={handleUpload}>Upload</button>

            </div>
        </div>
    )
}

export default ProfilePicture