import '../../styles/Navbar.scss'
import homeLogo from '../../assets/home_icon.svg'
import {useLocation, useNavigate} from 'react-router-dom'
import {useCookies} from "react-cookie";
import {useKeycloak} from "@react-keycloak/web";
import {useCallback, useEffect, useState} from "react";
import Searchbar from "./Searchbar";
import {v4 as uuid} from 'uuid'

const Navbar = ( { socket, setSocket }) => {

    const navigate = useNavigate()
    const location = useLocation()
    const { keycloak } = useKeycloak()
    const [notifications, setNotifications] = useState([])
    const [notification_focus, setNotification_focus] = useState(false)

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
            console.log(data)
            setNotifications([...notifications, data])
        })
    }

    useEffect(() => {
        console.log("notifications")
        console.log(notifications)
        console.log("===================")
    }, [notifications]);


    return (
        <div>
        {(location.pathname !== '/login') ?
            <nav className={"navbar_container"}>
                <img alt={'home'} src={homeLogo} onClick={() => navigate("/")} />
                <Searchbar id={cookies['profile_id']} socket={socket}/>
                <div className={'nav_buttons'}>
                    <img id={`notification_${notification_focus}`}
                         alt={'notifications'} src={require('../../assets/notification.png')} onClick={() => setNotification_focus(!notification_focus)}/>
                    {(notification_focus) ?
                    <ul className={'notification_list'}>
                        {notifications.map(x => {
                            return (
                                <li key={uuid()} id={x.type}>
                                    {x.type}
                                </li>
                            )
                        })}
                    </ul> : null}
                    <button onClick={() => (cookies['profile_id']) ? navigate(`/profile/${cookies['profile_id']}`) : null}>Profile</button>
                    <button onClick={() => {
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