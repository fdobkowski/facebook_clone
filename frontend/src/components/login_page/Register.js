import '../../styles/Register.scss'
import {Field, Form, Formik} from "formik";
import {useState} from "react";
import { Buffer } from 'buffer'
import { v4 as uuidv4 } from 'uuid'
import {useDispatch} from "react-redux";
import {getProfiles} from "../../redux/reducers/profileReducer";

const Register = ( { visible }) => {

    const axios = require('axios')
    const Yup = require('yup')
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const [customGender, setCustomGender] = useState("Female")
    const dispatch = useDispatch()

    const handleRegister = async (values) => {

        const id = uuidv4()

        const token = Buffer.from(`${id}:${values.email}:${values.number}:${values.password}`, 'utf8').toString('base64')

        await axios.get("/api/api/users", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(async () => {
            await axios.post("/api/api/profiles", {
                id: id,
                first_name: values.first_name,
                last_name: values.last_name,
                birthday: `${values.year}-${values.month}-${values.day}`,
                gender: values.gender,
                custom_gender: values.custom_gender,
                pronoun: values.pronoun,
                image: process.env.REACT_APP_AWS_IMAGE
            }).then((response) => {
                dispatch(getProfiles())
                alert(response.data)
            }).catch(error => console.error(error))
        }).catch(error => {
            if (error.response.status === 409) {
                alert(error.response.data)
            } else alert('Something went wrong')
        })

        visible.setVisible(false)
    }

    const yup_schema = Yup.object().shape({
        first_name: Yup.string().required('Required'),
        last_name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        number: Yup.number().typeError('Enter a number').required('Required'),
        password: Yup.string().required('Required'),
        re_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
        month: Yup.string().required('Required'),
        day: Yup.number().required('Required'),
        year: Yup.number().required('Required'),
        gender: Yup.string().required('Required'),
        pronoun: Yup.string().required('Required'),
        custom_gender: Yup.string()
    })

    return (
        <div className={"register_container"} id={customGender}>
            <div className={"register_header"}>
                <div>
                    <h2>Sign Up</h2>
                    <h5>It's quick and easy.</h5>
                </div>
                <img alt={'close'} src={require('../../assets/close.png')} onClick={() => visible.setVisible(false)}/>
            </div>
            <Formik initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                number: "",
                password: "",
                re_password: "",
                month: "1",
                day: 1,
                year: 1,
                gender: "Female",
                pronoun: "She",
                custom_gender: ""
            }} onSubmit={(values) => handleRegister(values)}
            validateOnChange={false} validationSchema={yup_schema}
            enableReinitialize={true}>
                {({ values, setFieldValue, errors }) => (
                    <Form className={"register_form"}>
                        <div className={"names"}>
                            <div>
                                <Field className={"type_form"} name={"first_name"} placeholder={"First name"}
                                       id={errors.first_name ? 'is_error' : 'no_error'}/>
                                <div className={"error"}>
                                    {errors.first_name ? errors.first_name : null}
                                </div>
                            </div>
                            <div>
                                <Field className={"type_form"} name={"last_name"} placeholder={"Last name"}
                                       id={errors.last_name ? 'is_error' : 'no_error'}/>
                                <div className={"error"}>
                                    {errors.last_name ? errors.last_name : null}
                                </div>
                            </div>
                        </div>
                        <Field className={"type_form"} name={"email"} placeholder={"Email"}
                               id={errors.email ? 'is_error' : 'no_error'}/>
                        <div className={"error"}>
                            {errors.email ? errors.email : null}
                        </div>
                        <Field className={"type_form"} name={"number"} placeholder={"Mobile number"}
                               id={errors.number ? 'is_error' : 'no_error'}/>
                        <div className={"error"}>
                            {errors.number ? errors.number : null}
                        </div>
                        <Field className={"type_form"} name={"password"} placeholder={"New password"} type={"password"}
                               id={errors.password ? 'is_error' : 'no_error'}/>
                        <div className={"error"}>
                            {errors.password ? errors.password : null}
                        </div>
                        <Field className={"type_form"} name={"re_password"} placeholder={"Confirm password"} type={"password"}
                               id={errors.re_password ? 'is_error' : 'no_error'}/>
                        <div className={"error"}>
                            {errors.re_password ? errors.re_password : null}
                        </div>
                        <span>Birthday</span>
                        <div className={"birthday"}>
                            <Field name={"month"} as={"select"} id={errors.month ? 'is_error' : 'no_error'}>
                                {months.map(x => (
                                    <option value={x} label={x} key={x}/>
                                ))}
                            </Field>
                            <div className={"error"}>
                                {errors.month ? errors.month : null}
                            </div>
                            <Field name={"day"} as={"select"} id={errors.day ? 'is_error' : 'no_error'}>
                                {[...Array(31)].map((x, i) => (
                                    <option value={i + 1} label={(i + 1).toString()} key={i}/>
                                ))}
                            </Field>
                            <div className={"error"}>
                                {errors.day ? errors.day : null}
                            </div>
                            <Field name={"year"} as={"select"} id={errors.year ? 'is_error' : 'no_error'}>
                                {[...Array(118)].map((x, i) => (
                                    <option value={-(i - 2022)} label={(-(i - 2022)).toString()} key={i}/>
                                ))}
                            </Field>
                            <div className={"error"}>
                                {errors.year ? errors.year : null}
                            </div>
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
                                    <span>Female</span>
                                </div>
                                <div onClick={() => {
                                    setFieldValue("pronoun", "He")
                                    setFieldValue("gender", "Male")
                                    setCustomGender("Male")
                                }}>
                                    <Field type={"radio"} value={"Male"} name={"gender"}/>
                                    <span>Male</span>
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
                                <Field name={"custom_gender"} placeholder={"Gender (optional)"}
                                       id={errors.custom_gender ? 'is_error' : 'no_error'}/>
                            </div> : null}
                            <div className={"error"}>
                                {errors.gender ? errors.gender : null}
                            </div>
                        </div>
                        <button className={"submit_button"} type={"submit"}>Sign up</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Register