import "../../styles/Login.scss"
import logoSvg from "../../assets/logo.svg"
import {Field, Form, Formik} from "formik";
import {useState} from "react";
import Register from "./Register";
import {useNavigate} from "react-router-dom";

const Login = () => {

    const axios = require('axios')
    const navigate = useNavigate()
    const [register, setRegister] = useState(false)

    const handleLogin = (values) => {
        // axios.post("http://localhost:5000/api/login", {
        //     username: values.login,
        //     password: values.password
        // }).then((response) => {
        //     alert("Welcome")
        //     navigate("/")
        // }).catch(err => alert(err.response.data))
    }

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