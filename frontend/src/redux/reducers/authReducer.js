import {createSlice} from "@reduxjs/toolkit";

const authReducer = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        first_name: '',
        last_name: '',
        id: ''
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.id = action.payload.id
        }
    }
})

export const { login } = authReducer.actions
export default authReducer.reducer