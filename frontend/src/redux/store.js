import profileReducer from "./reducers/profileReducer";
import postReducer from "./reducers/postReducer";
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

export const store = configureStore({
    reducer: {
        profiles: profileReducer,
        posts: postReducer,
        auth: authReducer
    }
})