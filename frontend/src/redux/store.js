import profileReducer from "./reducers/profileReducer";
import postReducer from "./reducers/postReducer";
import {configureStore} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        profiles: profileReducer,
        posts: postReducer
    }
})