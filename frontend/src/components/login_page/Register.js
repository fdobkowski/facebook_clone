import {Field, Form, Formik} from "formik";

const Register = ( { visible }) => {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const handleRegister = (values) => {
        console.log(values)
    }

    return (
        <div>
            <div>
                <h2>Sign Up</h2>
                <h4>It's quick and easy.</h4>
            </div>
            <button onClick={() => visible.setVisible(false)}>X</button>
            <Formik initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                number: 0,
                password: "",
                re_password: "",
                month: "",
                day: 0,
                year: 0,
                gender: "Female",
                pronoun: "",
                custom_gender: ""
            }} onSubmit={(values) => handleRegister(values)}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className={"names"}>
                            <Field name={"first_name"} placeholder={"First name"}/>
                            <Field name={"last_name"} placeholder={"Last name"}/>
                        </div>
                        <Field name={"email"} placeholder={"Email"}/>
                        <Field name={"number"} placeholder={"Mobile number"}/>
                        <Field name={"password"} placeholder={"New password"} type={"password"}/>
                        <Field name={"re_password"} placeholder={"Confirm password"} type={"password"}/>
                        <div className={"birthday"}>
                            <Field name={"month"} as={"select"}>
                                {months.map(x => (
                                    <option value={x} label={x} key={x}/>
                                ))}
                            </Field>
                            <Field name={"day"} as={"select"}>
                                {[...Array(31)].map((x, i) => (
                                    <option value={i + 1} label={(i + 1).toString()} key={i}/>
                                ))}
                            </Field>
                            <Field name={"year"} as={"select"}>
                                {[...Array(118)].map((x, i) => (
                                    <option value={-(i - 2022)} label={(-(i - 2022)).toString()} key={i}/>
                                ))}
                            </Field>
                        </div>
                        <div className={"gender"}>
                            <div>
                                <Field type={"radio"} value={"Female"} name={"gender"} onChange={() => {
                                    setFieldValue("pronoun", "She")
                                    setFieldValue("gender", "Female")
                                }}/>
                                Female
                            </div>
                            <div>
                                <Field type={"radio"} value={"Male"} name={"gender"} onChange={() => {
                                    setFieldValue("pronoun", "He")
                                    setFieldValue("gender", "Male")
                                }}/>
                                Male
                            </div>
                            <div>
                                <Field type={"radio"} value={"Custom"} name={"gender"}/>
                                Custom
                            </div>
                            {(values.gender === "Custom") ?
                            <div className={"custom_gender"}>
                                <Field name={"pronoun"} as={"select"} placeholder={"Select your pronoun"}>
                                    <option value={"She"} label={'She: "Wish her a happy birthday!"'}/>
                                    <option value={"He"} label={'He: "Wish him a happy birthday!"'}/>
                                    <option value={"They"} label={'They: "Wish them a happy birthday!"'}/>
                                </Field>
                                <Field name={"custom_gender"} placeholder={"Gender (optional)"}/>
                            </div> : null}
                        </div>
                        <button type={"submit"}>Sign up</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Register