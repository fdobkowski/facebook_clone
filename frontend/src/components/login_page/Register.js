import '../../styles/Register.scss'
import {Field, Form, Formik} from "formik";
import {useState} from "react";

const Register = ( { visible }) => {

    const axios = require('axios')
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const [customGender, setCustomGender] = useState("Female")

    const handleRegister = async (values) => {
        await axios.post("http://localhost:5000/api/users", {
            email: values.email,
            number: values.number,
            password: values.password
        }).then(async (response) => {
            await axios.post("http://localhost:5000/api/profiles", {
                first_name: values.first_name,
                last_name: values.last_name,
                birthday: `${values.year}-${values.month}-${values.day}`,
                gender: values.gender,
                custom_gender: values.custom_gender,
                pronoun: values.pronoun
            }).then((response) => alert(response.data)).catch(error => console.error(error))
        }).catch(error => console.error(error))

    }

    return (
        <div className={"register_container"} id={customGender}>
            <div className={"register_header"}>
                <div>
                    <h2>Sign Up</h2>
                    <h5>It's quick and easy.</h5>
                </div>
                <button onClick={() => visible.setVisible(false)}>X</button>
            </div>
            <Formik initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                number: "",
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
                    <Form className={"register_form"}>
                        <div className={"names"}>
                            <Field className={"type_form"} name={"first_name"} placeholder={"First name"}/>
                            <Field className={"type_form"} name={"last_name"} placeholder={"Last name"}/>
                        </div>
                        <Field className={"type_form"} name={"email"} placeholder={"Email"}/>
                        <Field className={"type_form"} name={"number"} placeholder={"Mobile number"}/>
                        <Field className={"type_form"} name={"password"} placeholder={"New password"} type={"password"}/>
                        <Field className={"type_form"} name={"re_password"} placeholder={"Confirm password"} type={"password"}/>
                        <span>Birthday</span>
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
                        <span>Gender</span>
                        <div className={"gender"}>
                            <div className={"m_or_f"}>
                                <div onClick={() => {
                                    setFieldValue("pronoun", "She")
                                    setFieldValue("gender", "Female")
                                    setCustomGender("Female")
                                }}>
                                    <Field type={"radio"} value={"Female"} name={"gender"} />
                                    Female
                                </div>
                                <div onClick={() => {
                                    setFieldValue("pronoun", "He")
                                    setFieldValue("gender", "Male")
                                    setCustomGender("Male")
                                }}>
                                    <Field type={"radio"} value={"Male"} name={"gender"}/>
                                    Male
                                </div>
                            </div>
                            <div className={"custom_radio"} onClick={() => {
                                setFieldValue("gender", "Custom")
                                setCustomGender("Custom")
                            }}>
                                <Field type={"radio"} value={"Custom"} name={"gender"}/>
                                Custom
                            </div>
                            {(values.gender === "Custom") ?
                            <div className={"custom_gender"}>
                                <span>Pronoun</span>
                                <Field name={"pronoun"} as={"select"} placeholder={"Select your pronoun"}>
                                    <option value={"She"} label={'She: "Wish her a happy birthday!"'}/>
                                    <option value={"He"} label={'He: "Wish him a happy birthday!"'}/>
                                    <option value={"They"} label={'They: "Wish them a happy birthday!"'}/>
                                </Field>
                                <Field name={"custom_gender"} placeholder={"Gender (optional)"}/>
                            </div> : null}
                        </div>
                        <button className={"submit_button"} type={"submit"}>Sign up</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Register