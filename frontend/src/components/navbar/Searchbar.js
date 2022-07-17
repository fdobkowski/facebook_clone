import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

const Searchbar = () => {

    const [profileFilter, setProfileFilter] = useState(/.*/i)
    const profiles = useSelector((state) => state.profiles.profiles.filter(x => profileFilter.test(x.first_name) || profileFilter.test(x.last_name)
        || profileFilter.test(`${x.first_name} ${x.last_name}`)))

    const [focused, setFocused] = useState(false)
    const navigate = useNavigate()
    const searchbar_ref = useRef()

    // useEffect(() => {
    //     console.log(profiles)
    // }, [profiles])


    useEffect(() => {
        document.addEventListener("click", (e) => {
            if (!searchbar_ref.current.contains(e.target)) {
                setFocused(false)
            }
        })
    }, [])

    return (
        <div className={'searchbar'} ref={searchbar_ref}>
            <input type={"text"} placeholder={'Search...'} onChange={(e) => {
                const regex = new RegExp(`^${e.target.value}.*`, 'i')
                setProfileFilter(regex)
            }} onFocus={() => setFocused(true)}/>
            {(focused) ?
            <ul className={'searchbar_ul'}>
                {(profiles) ?
                profiles.slice(0, 5).map(x => {
                    return (
                        <li key={x.id} onClick={() => navigate(`/profile/${x.id}`)}>
                            {x.first_name} {x.last_name}
                        </li>
                    )
                })
                : null}
            </ul> : null}
        </div>
    )
}

export default Searchbar