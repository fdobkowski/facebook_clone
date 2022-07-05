import '../styles/Protected.scss'
import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useState} from "react";

const Protected = () => {

    const { keycloak } = useKeycloak()

    const axios = require('axios')

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/api/posts').then(response => {
            setData(response.data)
        }).catch(err => console.error(err))
    }, [])

    return (
        // <div>
        //     <button onClick={() => keycloak.login()}>Log in</button>
        // </div>
        <div>
            <ul className={"post_container"}>
                {data.map(x => {
                    return (
                        <li key={x.id} className={"post_id"}>
                            <span>id: {x.id}</span>
                            <span>profile_id: {x.profile_id}</span>
                            <span>date: {x.date}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Protected
