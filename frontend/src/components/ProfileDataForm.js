import '../styles/ProfileDataForm.scss'
import {Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const ProfileDataForm = ( { data, setEdit } ) => {

    const Yup = require('yup')
    const axios = require('axios')

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const yup_schema = Yup.object().shape({
        first_name: Yup.string().required('Required'),
        last_name: Yup.string().required('Required'),
        gender: Yup.string().required('Required'),
        pronoun: Yup.string().required('Required'),
    })

    const navigate = useNavigate()

    const handleSubmit = (values) => {
        axios.patch(`http://localhost:5000/api/profiles/${data.id}/data`, {
            first_name: values.first_name,
            last_name: values.last_name,
            birthday: `${values.year}-${values.month}-${values.day}`,
            gender: (values.gender.toLowerCase() !== 'male' && values.gender.toLowerCase() !== 'female') ? 'Custom' : values.gender,
            custom_gender: (values.gender.toLowerCase() !== 'male' && values.gender.toLowerCase() !== 'female') ? values.gender : '',
            pronoun: values.pronoun
        })
            .then(() => navigate(0)).catch(err => console.error(err))
    }

    return (
        <div>
            <div onClick={() => setEdit(false)} className={'click_filter'}></div>
            <div className={'form_container'}>
                <div className={'form_header'}>
                    <span>Edit data</span>
                    <img onClick={() => setEdit(false)} alt={'close'} title={'close'} src={require('../assets/close.png')} />
                </div>
                {(data) ?
                <Formik
                    initialValues={{
                        first_name: data.first_name,
                        last_name: data.last_name,
                        month: `${months[new Date(data.birthday).getMonth()]}`,
                        day: new Date(data.birthday).getDay(),
                        year: new Date(data.birthday).getFullYear(),
                        gender: data.gender,
                        pronoun: data.pronoun
                    }}
                    onSubmit={(values) => handleSubmit(values)}
                    validateOnChange={false} validationSchema={yup_schema}
                    enableReinitialize={true}>
                    {({ errors }) => (
                    <Form>
                        <div>
                            <span>First name</span>
                            <Field name={'first_name'} id={errors.first_name ? 'is_error' : 'no_error'}/>
                            <div className={"error"}>
                                {errors.first_name ? errors.first_name : null}
                            </div>
                        </div>
                        <div>
                            <span>Last name</span>
                            <Field name={'last_name'} id={errors.last_name ? 'is_error' : 'no_error'} />
                            <div className={"error"}>
                                {errors.last_name ? errors.last_name : null}
                            </div>
                        </div>
                        <div className={'birthday'}>
                            <span>Birthday</span>
                            <div>
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
                                        <option defaultValue={new Date(data.birthday).getFullYear()} value={-(i - 2022)} label={(-(i - 2022)).toString()} key={i}/>
                                    ))}
                                </Field>
                            </div>
                        </div>
                        <div>
                            <span>Gender</span>
                            <Field name={'gender'}  />
                        </div>
                        <div>
                            <span>Pronoun</span>
                            <Field name={'pronoun'}  />
                        </div>
                        <button type={"submit"}>Submit</button>
                    </Form>
                        )}
                </Formik> : null}
            </div>
        </div>
    )
}

export default ProfileDataForm