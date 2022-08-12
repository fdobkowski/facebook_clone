import {createSlice} from "@reduxjs/toolkit";

const authReducer = createSlice({
    name: 'auth',
    initialState: {
        auth: false,
        first_name: '',
        last_name: '',
        id: '',
        token: ''
    },
    reducers: {
        login: (state, action) => {
            state.auth = true
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.id = action.payload.id
            state.token = action.payload.token

        },
        authenticated: (state, action) => {
            state.auth = true
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.id = action.payload.id
            state.token = action.payload.token
        }
    }
})

export const { login, authenticated } = authReducer.actions
export default authReducer.reducer