import {Field, Form, Formik} from "formik";

const Login = () => {

    const handleLogin = (values) => {
        
    }

    return (
        <Formik initialValues={{
            login: "",
            password: ""
        }} onSubmit={(values) => handleLogin(values)}>
            <Form>
                <Field name={"login"} placeholder={"Username or email"} />
                <Field name={"password"} placeholder={"Password"} type={"password"} />
                <button type={"submit"}>Log in</button>
                <button>Forgot password?</button>
                <button>Create new account</button>
            </Form>
        </Formik>
    )
}

export default Login