import "../../styles/Login.scss"
import logoSvg from "../../assets/logo.svg"
import {Field, Form, Formik} from "formik";
import {useState} from "react";
import Register from "./Register";

const Login = () => {

    const [register, setRegister] = useState(false)

    const handleLogin = (values) => {

    }

    return (
        <div className={"login_container"}>
            <img src={logoSvg} alt={"logo"} className={"login_logo"}/>
            <Formik initialValues={{
                login: "",
                password: ""
            }} onSubmit={(values) => handleLogin(values)}>
                <Form className={"login_form"}>
                    <Field name={"login"} placeholder={"Username or email"} />
                    <Field name={"password"} placeholder={"Password"} type={"password"} />
                    <button type={"submit"}>Log in</button>
                    <button>Forgot password?</button>
                    <button onClick={() => setRegister(!register)}>Create new account</button>
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