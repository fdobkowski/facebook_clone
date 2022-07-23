import './App.css'
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Login from "./components/login_page/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer";
import Protected from "./components/Protected";
import {useEffect, useState} from "react";
import io from "socket.io-client";
import { useBeforeunload } from 'react-beforeunload'
import {useCookies} from "react-cookie";
import Friendships from "./components/friendships/Friendships";


function App() {

    const [id, setId] = useState('')
    const [socket, setSocket] = useState(null)
    const location = useLocation()
    const [cookies, setCookies, removeCookies] = useCookies()

    useEffect(() => {
        if (location.pathname !== '/login' && !socket && (id || cookies['profile_id']) ) {
            setSocket(io.connect("http://localhost:4000"))
        }
    }, [location.pathname])


    if (socket) {
        socket.on('connect', () => {
            socket.emit('user_connected', (id || cookies['profile_id']))
        })
    }

    useBeforeunload((event) => {
        if (id || cookies['profile_id']) {
            socket.emit('user_disconnected', id || cookies['profile_id'])
            setSocket(null)
        }
    })

  return (
      <div>
        <Navbar socket={socket} setSocket={setSocket}/>
        <Routes>
            <Route path={"/login"} element={<Login setId={setId}/>}/>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/profile/:id"} element={<Profile/>}/>
            <Route path={"/profile/:id/friends"} element={<Friendships/>}/>
            <Route path={"/protected"} element={<Protected/>}/>
        </Routes>
        <Footer />
      </div>
  )
}

export default App;
