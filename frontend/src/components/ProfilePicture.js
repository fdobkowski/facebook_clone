import '../styles/ProfilePicture.scss'
import {useEffect, useState} from "react";
import { Buffer } from 'buffer'
import S3 from 'react-aws-s3'
import AWS from 'aws-sdk'
import {uploadFile} from "react-s3";
import {useCookies} from "react-cookie";
import {useDispatch} from "react-redux";
import {changeProfilePicture, getProfiles} from "../redux/reducers/profileReducer";
import axios from "axios";
window.Buffer = window.Buffer || Buffer

const ProfilePicture = ({ profile } ) => {

    const [file, setFile] = useState(null)
    const [url, setUrl] = useState(null)
    const [cookies] = useCookies()
    const dispatch = useDispatch()
    const [temporaryImage, setTemporaryImage] = useState(profile.image)

    AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
    })

    const bucket = new AWS.S3({
        params: { Bucket: process.env.REACT_APP_AWS_BUCKET_NAME},
        region: process.env.REACT_APP_AWS_BUCKET_REGION
    })

    const handleUpload = async () => {
        if (file) {
            if (file.size > 100000) alert('Image size is too large')
            else {
                const params = {
                    Body: file,
                    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                    Key: cookies['profile_id']
                }

                await bucket.putObject(params)
                    .send(err => {
                        if (err) console.error(err)
                    })

                const newUrl = bucket.getSignedUrl('getObject', {
                    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                    Key: cookies['profile_id']
                })

                await axios.patch(`http://localhost:5000/api/profiles/${cookies['profile_id']}`, {url: newUrl})
                    .then(() => dispatch(getProfiles)).catch(err => console.error(err))

            }
        }
    }

    const imageChange = (e) => {
        setFile(e.target.files[0])

        const objectUrl = URL.createObjectURL(e.target.files[0])
        setTemporaryImage(objectUrl)
    }

    return (
        <div className={'profile_picture_container'}>
            <img alt={'picture'} src={temporaryImage} />
            <div>
                <input type={'file'} name={'image'} accept={'image/png,image/jpeg,image/bmp,image/gif,image/tiff'} onChange={e => imageChange(e)}/>
                <button type={"submit"} onClick={handleUpload}>Upload</button>
            </div>
        </div>
    )
}

export default ProfilePicture