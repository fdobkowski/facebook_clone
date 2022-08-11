import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import { store } from './redux/store'
import {getProfiles} from "./redux/reducers/profileReducer";
import {getPosts} from "./redux/reducers/postReducer";
import _kc from "./Keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import {BrowserRouter as Router} from "react-router-dom";

if (store.getState().profiles.status === 'idle') store.dispatch(getProfiles())
if (store.getState().posts.status === 'idle') store.dispatch(getPosts())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ReactKeycloakProvider authClient={_kc}>
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </ReactKeycloakProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
