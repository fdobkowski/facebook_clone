import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

const Searchbar = ({ id, socket }) => {

    const [profileFilter, setProfileFilter] = useState(/.*/i)
    const profiles = useSelector((state) => state.profiles.profiles.filter(x => profileFilter.test(x.first_name) || profileFilter.test(x.last_name)
        || profileFilter.test(`${x.first_name} ${x.last_name}`)))

    const [focused, setFocused] = useState(false)
    const navigate = useNavigate()
    const searchbar_ref = useRef(null)
    const friend_ref = useRef([])
    const [sent, setSent] = useState(false)


    useEffect(() => {
        friend_ref.current = friend_ref.current.slice(0, profiles.length)
    }, [profiles])

    const hideSearchResult = (e) => {
        if (window.location.pathname !== '/login' && searchbar_ref.current && !searchbar_ref.current.contains(e.target)) {
            console.log(friend_ref.current)
            if (!Object.values(friend_ref.current).includes(e.target)) setFocused(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", hideSearchResult)
        return () => document.removeEventListener("click", hideSearchResult)
    }, [])

    const handleFriendRequest = (receiver_id, ref_id) => {
        socket.emit('send_friend_request', ({sender_id: id, receiver_id: receiver_id}))
        friend_ref.current[ref_id].id = 'sent_true'
    }

    return (
        <div className={'searchbar'}>
            <input type={"text"} placeholder={'Search...'} onChange={(e) => {
                const regex = new RegExp(`^${e.target.value}.*`, 'i')
                setProfileFilter(regex)
            }} onFocus={() => setFocused(true)} ref={searchbar_ref}/>
            {(focused) ?
            <ul className={'searchbar_ul'}>
                {(profiles) ?
                profiles.slice(0, 5).map((x, i) => {
                    return (
                        <li key={x.id}>
                            <span onClick={() => navigate(`/profile/${x.id}`)}>{x.first_name} {x.last_name}</span>
                            <img id={`sent_false`}
                                 alt={'add_friend'}
                                 src={require('../../assets/add.png')} onClick={() => handleFriendRequest(x.id, i)}
                                 ref={el => friend_ref.current[i] = el}
                            />
                        </li>
                    )
                })
                : null}
            </ul> : null}
        </div>
    )
}

export default Searchbar