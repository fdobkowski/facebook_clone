import '../styles/Protected.scss'
import {useKeycloak} from "@react-keycloak/web";
import {useCallback, useEffect, useState} from "react";

const Protected = () => {

    const axios = require('axios')

    const [data, setData] = useState([])
    const { keycloak } = useKeycloak()

    const { authenticated } = keycloak

    const handleLogin = useCallback(() => {
        keycloak.login()
    }, [keycloak])

    useEffect(() => {
        if (keycloak.token) {
        axios.get('http://localhost:5000/api/protected/posts', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => {
            setData(response.data)
        }).catch(err => console.error(err))
    }}, [keycloak.token])

    return (
        <div>
            {(!authenticated) ?
            <div>
                <button onClick={handleLogin}>Log in</button>
            </div> :
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
                <button onClick={() => keycloak.logout()}>Logout</button>
            </div>}
        </div>
    )
}

export default Protected
