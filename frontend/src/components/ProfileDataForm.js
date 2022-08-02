import '../styles/ProfileDataForm.scss'
import {Field, Form, Formik} from "formik";

const ProfileDataForm = ( { data, setEdit } ) => {
    return (
        <div>
            <div onClick={() => setEdit(false)} className={'click_filter'}></div>
            <div className={'form_container'}>
                <div className={'form_header'}>
                    <span>Edit data</span>
                    <img onClick={() => setEdit(false)} alt={'close'} title={'close'} src={require('../assets/close.png')} />
                </div>
                <Formik
                    initialValues={{test: 'test'}}
                    onSubmit={() => console.log(data)}>
                    <Form>
                        <div>
                            <span>First name</span>
                            <Field value={data.first_name} />
                        </div>
                        <div>
                            <span>Last name</span>
                            <Field value={data.last_name} />
                        </div>
                        <div>
                            <span>Birthday</span>
                            <Field value={new Date(data.birthday).toLocaleDateString()} />
                        </div>
                        <div>
                            <span>Gender</span>
                            <Field value={data.gender} />
                        </div>
                        <div>
                            <span>Pronoun</span>
                            <Field value={data.pronoun} />
                        </div>
                        <button type={"submit"}>Submit</button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default ProfileDataForm