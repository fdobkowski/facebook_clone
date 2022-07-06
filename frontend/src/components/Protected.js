import '../styles/Protected.scss'
import {useKeycloak} from "@react-keycloak/web";
import {useEffect, useState} from "react";
import _kc from '../Keycloak'

const Protected = () => {

    const axios = require('axios')

    const [data, setData] = useState([])

    // ------- KEYCLOAK VERSION -------------

    // useEffect(async () => {
    //     await _kc.init({
    //         onLoad: "login-required",
    //         redirectUri: "http://localhost:3000/protected",
    //         checkLoginIframe: false,
    //         pkceMethod: 'S256',
    //     })
    //         .then((authenticated) => {
    //             if (!authenticated) console.log("user is not authenticated..!")
    //             axios.get('http://localhost:5000/api/protected/posts', {
    //                 headers: {
    //                     'Authorization': 'Bearer ' + _kc.token
    //                 }
    //             }).then(result => setData(result.data)).catch(error => console.error(error))
    //         })
    //         .catch(error => console.error(error))
    // })
    //
    // const { keycloak } = useKeycloak()
    // const { authenticated } = keycloak

    // -------------------------------------

    useEffect(() => {
        axios.get('http://localhost:5000/api/posts').then(response => {
            setData(response.data)
        }).catch(err => console.error(err))
    }, [])

    return (
        // <div>
        //     {(!authenticated) ?
        //     <div>
        //         <button onClick={() => keycloak?.login()}>Log in</button>
        //     </div> :
        //     <div>
        //         <ul className={"post_container"}>
        //             {data.map(x => {
        //                 return (
        //                     <li key={x.id} className={"post_id"}>
        //                         <span>id: {x.id}</span>
        //                         <span>profile_id: {x.profile_id}</span>
        //                         <span>date: {x.date}</span>
        //                     </li>
        //                 )
        //             })}
        //         </ul>
        //     </div>}
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
