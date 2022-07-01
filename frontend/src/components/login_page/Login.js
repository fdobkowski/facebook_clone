import {Field, Form, Formik} from "formik";
import {useState} from "react";
import Register from "./Register";

const Login = () => {

    const [register, setRegister] = useState(false)

    const handleLogin = (values) => {

    }

    return (
        <div>
            <div className={"login_logo"}>
                facebook_clone
            </div>
            <Formik initialValues={{
                login: "",
                password: ""
            }} onSubmit={(values) => handleLogin(values)}>
                <Form>
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