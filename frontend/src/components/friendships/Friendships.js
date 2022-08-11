import '../../styles/Friendships.scss'
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getFriendships} from "../../redux/reducers/profileReducer";
import {useNavigate} from "react-router-dom";

const Friendships = () => {

    const [cookies] = useCookies()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.profiles.main_profile)
    const profile = useSelector((state) => state.profiles.profiles.find(x => x.id === user.id))
    const all_profiles = useSelector((state) => state.profiles.profiles)
    const [filter, setFilter] = useState(/.*/i)
    const [friends, setFriends] = useState([])
    const [filteredFriends, setFilteredFriends] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getFriendships(user.id))
    }, [])

    useEffect(() => {
        if (profile && profile.friendships) {
            setFriends(profile.friendships.map(x => {
                return all_profiles.find(y => y.id === x.friend)
            }))

            setFilteredFriends(profile.friendships.map(x => {
                return all_profiles.find(y => y.id === x.friend)
            }))
        }
    }, [profile])


    useEffect(() => {
        if (profile && friends && filteredFriends) {
            setFilteredFriends(friends.filter(x => filter.test(x.first_name) || filter.test(x.last_name) || filter.test(`${x.first_name} ${x.last_name}`)))
        }
    }, [filter])

    const friends_list = (friend) => {

        const handleClick = () => navigate(`/profile/${friend.id}`)

        return (
            <li key={friend.id} onClick={handleClick}>
                <div>
                    <img alt={'profile_picture'} src={friend.image}/>
                </div>
                <span>{friend.first_name} {friend.last_name}</span>
            </li>
        )
    }

    return (
        <div className={'friends_container'}>
            <span className={'friends_header'}>Friends list</span>
            <input className={'friends_search'} placeholder={'Search friend...'} onChange={(e) => {
                const regex = new RegExp(`^${e.target.value}.*`, 'i')
                setFilter(regex)
            }}/>
            {(profile && friends.length !== 0) ?
            <ul>
                {(profile && filteredFriends) ?
                filteredFriends.map(x => {
                    return (
                        friends_list(x)
                    )
                }) : null}
            </ul>
                :
            <div className={'empty_friends'}>
                You have no friends yet
            </div> }
        </div>
    )
}

export default Friendships