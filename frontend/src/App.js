import './App.css'
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Login from "./components/login_page/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer";
import Protected from "./components/Protected";
import _kc from "./Keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import io from "socket.io-client";


function App() {

    const [cookies] = useCookies(['user'])
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        console.log('id')
        if (window.location.pathname !== '/login' && !socket && cookies['profile_id']) {
            setSocket(io.connect("http://localhost:4000"))
        }
    }, [window.location.pathname])


    if (socket) {
        socket.on('connect', () => {
            socket.emit('user_connected', (cookies['profile_id']))
        })
    }

    useEffect(() => {
        const handleTabClose = (event) => {
            event.preventDefault()

            return event.returnValue = () => {
                if (cookies['profile_id']) {
                    socket.emit('user_disconnected', cookies['profile_id'])
                    setSocket(null)
                }
            }
        }

        window.addEventListener("beforeunload", handleTabClose)
        return () => {
            window.removeEventListener("beforeunload", handleTabClose)
        }
    }, [])


  return (
      <ReactKeycloakProvider authClient={_kc}>
        <Router>
                <Navbar socket={socket}/>
              <Routes>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/profile/:id"} element={<Profile/>}/>
                <Route path={"/protected"} element={<Protected/>}/>
              </Routes>
                <Footer />
        </Router>
      </ReactKeycloakProvider>
  );
}

export default App;
