import '../../styles/Navbar.scss'
import homeLogo from '../../assets/home_icon.svg'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useEffect, useRef, useState} from "react";
import Searchbar from "./Searchbar";
import {v4 as uuid} from 'uuid'
import {useDispatch, useSelector} from "react-redux";
import {getFriendships, getProfiles} from "../../redux/reducers/profileReducer";

const Navbar = ( { socket, setSocket, setChats }) => {

    const navigate = useNavigate()
    const location = useLocation()
    const [notifications, setNotifications] = useState([])
    const [notification_focus, setNotification_focus] = useState(false)
    const notification_ref = useRef(null)
    const profiles = useSelector((state) => state.profiles.profiles)
    const axios = require('axios')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.profiles.main_profile)


    const handleLogout = () => {
        removeCookies('token', { path: '/' })
        removeCookies('status', { path: '/' })
        setNotifications([])
        socket.emit('user_disconnected', user.id)
        setSocket(null)
        setChats([])
        socket.disconnect()
        navigate(0)
    }

    const [cookies, setCookies, removeCookies] = useCookies()

    if (socket) {
        socket.on('receive_notification', (data) => {
            dispatch(getProfiles())
            dispatch(getFriendships(user.id))
            setNotifications([data, ...notifications])
        })

        socket.on('receive_old_notifications', (data) => {
            setNotifications([...notifications, ...data.map(x => {
                return {
                    id: x.id,
                    type: x.type,
                    from: x.sender_id,
                    date: x.date,
                    seen: x.seen

                }
            })])
        })
    }

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
        axios.patch(`http://localhost:5000/api/notifications/${notification.id}`, {status: 'declined'}, {
            headers: {
                'Authorization': 'Bearer ' + cookies['token']
            }
        })
            .then(() => {
                setNotifications(notifications.map(x => {
                    if (x === notification) {
                        x.seen = true
                        return x
                    } else return x
                }))
            }).catch(err => console.error(err))
    }

    const handleAccept = (notification) => {
        axios.patch(`http://localhost:5000/api/notifications/${notification.id}`, {status: 'accepted'}, {
            headers: {
                'Authorization': 'Bearer ' + cookies['token']
            }
        })
            .then(() => {
                setNotifications(notifications.map(x => {
                    if (x === notification) {
                        x.seen = true
                        return x
                    } else return x
                }))

                const date = new Date()
                axios.post('http://localhost:5000/api/friendships', {
                    sender_id: notification.from,
                    receiver_id: user.id,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                }).then(() => {
                    alert(`You are now friends with ${profiles.find(x => x.id === notification.from).first_name}`)
                    navigate(0)
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
    }

    return (
        <div>
        {(location.pathname !== '/login') ?
            <nav className={"navbar_container"}>
                <img alt={'home'} src={homeLogo} onClick={() => navigate("/")} title={'Home'}/>
                <Searchbar socket={socket} notification_ref={notification_ref}/>
                <div className={'nav_buttons'}>
                    <img id={`notification_${notification_focus}`}
                         alt={'notifications'} ref={notification_ref}
                         title={'Notifications'}
                         src={
                             (notifications.filter(x => !x.seen).length === 0) ? require('../../assets/notification.png') : require('../../assets/new_notification.png')
                         } onClick={() => setNotification_focus(!notification_focus)}/>
                    {(notification_focus) ?
                    <ul className={'notification_list'}>
                        {(notifications.length !== 0) ?
                            notifications.map(x => {
                                return (
                                    <li key={uuid()} className={`seen_${x.seen}`}>
                                        {(x.type === 'friend_request' && profiles.find(y => y.id === x.from)) ?
                                            <div className={'friend_request'}>
                                                <div>
                                                    <img alt={'profile_picture'} src={profiles.find(y => y.id === x.from).image}
                                                         onClick={() => navigate(`/profile/${x.from}`)} />
                                                </div>
                                                <div>
                                                    <span>{`${(profiles) ? profiles.find(y => y.id === x.from).first_name : ''} has sent you a friend request`}</span>
                                                    {(!x.seen) ?
                                                    <div>
                                                        <button onClick={() => handleAccept(x)}>Accept</button>
                                                        <button onClick={() => handleDecline(x)}>Decline</button>
                                                    </div> : null}
                                                </div>
                                                <div className={'notification_date'}>
                                                    <span>
                                                        {new Date(x.date).toLocaleTimeString('default', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    <span>
                                                        {new Date(x.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div> : null}
                                    </li>
                                )
                        }) :
                        <li className={'empty_notifications'}>
                            You have no notifications
                        </li>}
                    </ul> : null}
                    <button className={'util_button'} onClick={() => (user.id) ? navigate(`/profile/${user.id}`) : null}>
                        <span>Profile</span>
                        <img alt={'profile'} src={require('../../assets/user.png')} title={'Profile'}/>
                    </button>
                    <button className={'util_button'} onClick={() => handleLogout()}>
                        <span onClick={() => handleLogout()}>Logout</span>
                        <img onClick={() => handleLogout()} alt={'logout'} src={require('../../assets/logout.png')} title={'Logout'}/>
                    </button>
                </div>

            </nav> : null }
        </div>
    )
}

export default Navbar
