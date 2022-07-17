import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

const Searchbar = () => {

    const [profileFilter, setProfileFilter] = useState(/.*/i)
    const profiles = useSelector((state) => state.profiles.profiles.filter(x => profileFilter.test(x.first_name) || profileFilter.test(x.last_name)
        || profileFilter.test(`${x.first_name} ${x.last_name}`)))

    useEffect(() => {
        console.log(profiles)
    }, [profiles])

    // useEffect(() => {
    //     profiles.map(x => {
    //         console.log(profileFilter.test(x.first_name))
    //     })
    // }, [profiles])

    return (
        <div className={'searchbar'}>
            <input type={"text"} placeholder={'Search...'} onChange={(e) => {
                const regex = new RegExp(`^${e.target.value}.*`, 'i')
                setProfileFilter(regex)
            }}/>
            <ul>
                {(profiles) ?
                profiles.slice(0, 10).map(x => {
                    return (
                        <li key={x.id}>
                            {x.first_name} {x.last_name}
                        </li>
                    )
                })
                : null}
            </ul>
        </div>
    )
}

export default Searchbar