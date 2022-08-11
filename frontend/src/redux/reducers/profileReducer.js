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

export const getFriendships = createAsyncThunk('profiles/getFriendships', async (id, thunkAPI) => {
    try {
        return await axios.get(`http://localhost:5000/api/friendships/${id}`)
            .then(response => {
                return {
                    id: id,
                    data: response.data.map(x => {
                        if (x.receiver_id === id) {
                            return {
                                friend: x.sender_id,
                                date: x.date
                            }
                        } else {
                            return {
                                friend: x.receiver_id,
                                date: x.date
                            }
                        }
                    })
                }
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
        profiles: [],
        profile_status: 'idle',
        main_profile: {}
    },
    reducers: {
        get_main_profile: (state, action) => {
            state.main_profile = state.profiles.find(x => x.id === action.payload)
            state.profile_status = 'loaded'
        }
    },
    extraReducers(builder) {
        builder.addCase(getProfiles.rejected, (state, action) => {
            state.status = action.payload
        }).addCase(getProfiles.fulfilled, (state, action) => {
            state.profiles = action.payload
            state.status = 'loaded'
        }).addCase(getFriendships.fulfilled, (state, action) => {
            state.main_profile.friendships = action.payload.data
            state.profiles = state.profiles.map(x => {
                if (x.id === action.payload.id) {
                    x.friendships = action.payload.data
                }
                return x
            })
        })
    }
})

export const { get_main_profile } = profileReducer.actions
export default profileReducer.reducer