import "../../styles/Login.scss"
import logoSvg from "../../assets/logo.svg"
import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import Register from "./Register";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import { Buffer } from 'buffer'

const Login = ( { setId }) => {

    const axios = require('axios')
    const navigate = useNavigate()
    const [register, setRegister] = useState(false)
    const [cookies, setCookies] = useCookies(['user'])

    const handleLogin = async (values) => {

        if (values.login === "" || values.password === "") return

        const token = Buffer.from(`${values.login}:${values.password}`, 'utf8').toString('base64')

        await axios.get("http://localhost:5000/api/login", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            setCookies("profile_id", response.data.id)
            setCookies('profile_first_name', response.data.first_name)
            setCookies('profile_last_name', response.data.last_name)
            setId(response.data.id)
            navigate('/')
        }).catch(error => alert(error.response.data))
    }

    useEffect(() => {
        if (cookies["profile_id"]) {
            navigate('/')
        }
    }, [])

    return (
        <div className={"login_container"}>
            <img src={logoSvg} alt={"logo"} className={"login_logo"} id={`register_${register}`}/>
            <Formik initialValues={{
                login: "",
                password: ""
            }} onSubmit={(values) => handleLogin(values)}>
                <Form className={"login_form"} id={`register_${register}`}>
                    <Field name={"login"} placeholder={"Email or mobile number"} />
                    <Field name={"password"} placeholder={"Password"} type={"password"} />
                    <button type={"submit"} className={"login_button"}>Log in</button>
                    <button className={"forgot_password_button"}>Forgot password?</button>
                    <button className={"new_acc_button"} onClick={() => setRegister(!register)}>Create new account</button>
                </Form>
            </Formik>
            {(register) ?
                <Register visible={{
                    setVisible: setRegister
                }}/> : null}
        </div>
    )
}

export default Login