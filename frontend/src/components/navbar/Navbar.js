import '../../styles/Navbar.scss'
import homeLogo from '../../assets/home_icon.svg'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useKeycloak} from "@react-keycloak/web";
import {useCallback, useEffect, useRef, useState} from "react";
import Searchbar from "./Searchbar";
import {v4 as uuid} from 'uuid'
import {useSelector} from "react-redux";

const Navbar = ( { socket, setSocket }) => {

    const navigate = useNavigate()
    const location = useLocation()
    const { keycloak } = useKeycloak()
    const [notifications, setNotifications] = useState([])
    const [notification_focus, setNotification_focus] = useState(false)
    const notification_ref = useRef(null)
    const profiles = useSelector((state) => state.profiles.profiles)
    const axios = require('axios')

    const handleLogout = useCallback(() => {
        if (keycloak.authenticated) keycloak.logout()
    }, [keycloak])


    const [cookies, setCookies, removeCookies] = useCookies(['profile_id'])

    useEffect(() => {
        if (cookies['profile_id'] === undefined) {
            navigate('/login')
        }
    }, [])

    if (socket) {
        socket.on('receive_notification', (data) => {
            setNotifications([data, ...notifications])
        })

        socket.on('receive_old_notifications', (data) => {
            console.log(data)
            setNotifications([...notifications, ...data.map(x => {
                return {
                    id: x.id,
                    type: x.type,
                    from: x.sender_id,
                    seen: x.seen

                }
            })])
        })
    }

    useEffect(() => {
        console.log("notifications")
        console.log(notifications)
        console.log("===================")
    }, [notifications]);

    const hideNotifications = (e) => {
        if (window.location.pathname !== '/login' && notification_ref.current && !notification_ref.current.contains(e.target)) {
            setNotification_focus(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", hideNotifications)
        return () => document.removeEventListener("click", hideNotifications)
    }, [])

    const handleDecline = (notification) => {
        axios.patch(`http://localhost:5000/api/notifications/${notification.id}`)
            .then(() => {
                setNotifications(notifications.map(x => {
                    if (x === notification) {
                        x.seen = true
                        return x
                    } else return x
                }))
            }).catch(err => console.error(err))
    }

    return (
        <div>
        {(location.pathname !== '/login') ?
            <nav className={"navbar_container"}>
                <img alt={'home'} src={homeLogo} onClick={() => navigate("/")} />
                <Searchbar id={cookies['profile_id']} socket={socket} notification_ref={notification_ref}/>
                <div className={'nav_buttons'}>
                    <img id={`notification_${notification_focus}`}
                         alt={'notifications'} ref={notification_ref}
                         src={
                             (notifications.filter(x => !x.seen).length === 0) ? require('../../assets/notification.png') : require('../../assets/new_notification.png')
                         } onClick={() => setNotification_focus(!notification_focus)}/>
                    {(notification_focus) ?
                    <ul className={'notification_list'}>
                        {(notifications.length !== 0) ?
                            notifications.map(x => {
                                return (
                                    <li key={uuid()} className={`seen_${x.seen}`}>
                                        {(x.type === 'friend_request') ?
                                            <div className={'friend_request'}>
                                                <img alt={'profile_picture'} src={require('../../assets/fb_profile_picture.png')}
                                                     onClick={() => navigate(`/profile/${x.from}`)} />
                                                <div>
                                                    <span>{`${profiles.find(y => y.id === x.from).first_name} has sent you a friend request`}</span>
                                                    {(!x.seen) ?
                                                    <div>
                                                        <button>Accept</button>
                                                        <button onClick={() => handleDecline(x)}>Decline</button>
                                                    </div> : null}
                                                </div>
                                            </div> : null}
                                    </li>
                                )
                        }) :
                        <li className={'empty_notifications'}>
                            You have no notifications
                        </li>}
                    </ul> : null}
                    <button className={'util_button'} onClick={() => (cookies['profile_id']) ? navigate(`/profile/${cookies['profile_id']}`) : null}>Profile</button>
                    <button className={'util_button'} onClick={() => {
                        removeCookies('profile_id')
                        removeCookies('profile_first_name')
                        removeCookies('profile_last_name')
                        socket.emit('user_disconnected', cookies['profile_id'])
                        setSocket(null)
                        socket.disconnect()
                        handleLogout()
                        navigate('/login')
                    }}>Logout</button>
                </div>

            </nav> : null }
        </div>
    )
}

export default Navbar