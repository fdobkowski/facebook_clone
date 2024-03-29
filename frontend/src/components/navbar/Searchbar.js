import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getFriendships, getNotificationStatus} from "../../redux/reducers/profileReducer";

const Searchbar = ({ socket, notification_ref }) => {

    const [profileFilter, setProfileFilter] = useState(/^.*/i)
    const main_profile = useSelector((state) => state.profiles.main_profile)
    const auth = useSelector((state) => state.auth)
    const profiles = useSelector((state) => state.profiles.profiles.filter(x => x.id !== main_profile.id &&
        (profileFilter.test(x.first_name) || profileFilter.test(x.last_name) || profileFilter.test(`${x.first_name} ${x.last_name}`))))

    const [focused, setFocused] = useState(false)
    const navigate = useNavigate()
    const searchbar_ref = useRef(null)
    const friend_ref = useRef([])
    const dispatch = useDispatch()


    useEffect(() => {
        if (auth.auth && !main_profile.notifications) dispatch(getNotificationStatus(auth))
    }, [auth])

    useEffect(() => {
        friend_ref.current = friend_ref.current.slice(0, profiles.length)
    }, [profiles])

    const hideSearchResult = (e) => {
        if (window.location.pathname !== '/login' && searchbar_ref.current && !searchbar_ref.current.contains(e.target)) {
            if (!Object.values(friend_ref.current).includes(e.target) && !notification_ref.current.contains(e.target)) setFocused(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", hideSearchResult)
        return () => document.removeEventListener("click", hideSearchResult)
    }, [])

    const handleFriendRequest = (receiver_id, ref_id) => {
        socket.emit('send_friend_request', ({sender_id: main_profile.id, receiver_id: receiver_id}))
        friend_ref.current[ref_id].id = 'sent_true'
    }

    useEffect(() => {
        if (main_profile && !main_profile.friendships) dispatch(getFriendships(main_profile.id))
    }, [main_profile])

    return (
        <div className={'searchbar'}>
            <input type={"text"} placeholder={'Search...'} onChange={(e) => {
                const regex = new RegExp(`^${e.target.value}.*`, 'i')
                setProfileFilter(regex)
            }} onFocus={() => setFocused(true)} ref={searchbar_ref}/>
            {(focused) ?
            <ul className={'searchbar_ul'}>
                {(profiles) ?
                profiles.slice(0, (String(profileFilter) === String(/^.*/i)) ? 0 : 5).map((x, i) => {
                    return (
                        <li key={x.id}>
                            <div className={'profile_image'} onClick={() => navigate(`/profile/${x.id}`)}>
                                <img alt={'profile_picture'} src={x.image}/>
                            </div>
                            <span onClick={() => navigate(`/profile/${x.id}`)}>{x.first_name} {x.last_name}</span>
                            {(main_profile && main_profile.friendships && main_profile.friendships.filter(y => y.friend === x.id).length === 0) ?
                            <img id={(x.sent_notification) ? 'sent_true' : 'sent_false'}
                                 alt={'add_friend'}
                                 src={require('../../assets/add.png')} onClick={() => handleFriendRequest(x.id, i)}
                                 ref={el => friend_ref.current[i] = el}
                            /> :
                            <img id={`sent_false`} alt={'added'} src={require('../../assets/added.png')} style={{opacity: 1}}/>}
                        </li>
                    )
                })
                : null}
            </ul> : null}
        </div>
    )
}

export default Searchbar