import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios'

export const getProfiles = createAsyncThunk('profiles/getProfiles', async () => {
    try {
        return await axios.get('http://localhost:5000/api/profiles')
            .then(response => {
                return response.data
            }).catch(err => {
                return err
            })
    } catch (err) {
        return err.message
    }
})

const profileReducer = createSlice({
    name: 'profiles',
    initialState: {
        status: 'idle',
        profiles: []
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getProfiles.rejected, (state, action) => {
            state.status = action.payload
        }).addCase(getProfiles.fulfilled, (state, action) => {
            state.profiles = action.payload
            state.status = 'loaded'
        })
    }
})

export default profileReducer.reducer