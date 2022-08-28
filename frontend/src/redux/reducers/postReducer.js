import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from 'axios'

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    try {
        return await axios.get('/api/api/posts')
            .then(response => {
                return response.data
            }).catch(err => {
                return err
            })
    } catch (err) {
        return err.message
    }
})

const postReducer = createSlice({
    name: 'posts',
    initialState: {
        status: 'idle',
        posts: []
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getPosts.rejected, (state, action) => {
            state.status = action.payload
        }).addCase(getPosts.fulfilled, (state, action) => {
            state.posts = action.payload
            state.status = 'loaded'
        })
    }
})

export default postReducer.reducer