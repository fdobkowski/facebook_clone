import './App.css'
import {Routes, Route, useLocation, useNavigate} from "react-router-dom";
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
import {useDispatch, useSelector} from "react-redux";
import Chat from "./components/friendships/Chat";


function App() {

    const [id, setId] = useState('')
    const [socket, setSocket] = useState(null)
    const location = useLocation()
    const [cookies] = useCookies()
    const [chats, setChats] = useState([])
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth.token !== '')

    useEffect(() => {
        if ((!cookies['status'] || cookies['status'] !== 'authenticated') && !auth) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if (location.pathname !== '/login' && !socket && (id || cookies['profile_id']) ) {
            setSocket(io.connect("http://localhost:4000"))
        }
    }, [location.pathname])


    if (socket) {
        socket.on('connect', () => {
            socket.emit('user_connected', (id || cookies['profile_id']))
        })

        socket.on('enable_chat', (data) => {
            if (chats.filter(x => x.receiver_id === data.receiver_id).length === 0) {
                if (chats.length === 3 && window.innerWidth > 1060) {
                    setChats(chats.shift())
                } else if (1060 >= window.innerWidth && window.innerWidth > 768 && chats.length === 2) {
                    setChats(chats.shift())
                } else if (window.innerWidth <= 480 && chats.length === 1) {
                    setChats(chats.shift())
                }
                setChats([...chats, {receiver_id: data.receiver_id, chat_id: data.chat_id}])
            }
            else setChats(chats)
        })

        socket.on('new_chat', (data) => {

            if (chats.find(x => x.chat_id === data.chat_id) === undefined) {
                socket.emit('join_chat', {
                    sender_id: data.receiver_id,
                    receiver_id: data.sender_id
                })
            }
        })
    }

    const disableChat = (id) => {
        setChats(chats.filter(x => x.receiver_id !== id))
    }

    useBeforeunload(() => {
        if (id || cookies['profile_id']) {
            socket.emit('user_disconnected', id || cookies['profile_id'])
            setSocket(null)
            setChats([])
        }
    })

  return (
      <div>
        <Navbar socket={socket} setSocket={setSocket} setChats={setChats}/>
        <Routes>
            <Route path={"/login"} element={<Login setId={setId}/>}/>
            <Route path={"/"} element={<Home socket={socket}/>}/>
            <Route path={"/profile/:id"} element={<Profile socket={socket}/>}/>
            <Route path={"/profile/:id/friends"} element={<Friendships/>}/>
            <Route path={"/protected"} element={<Protected/>}/>
        </Routes>
          {(chats) ? chats.map((x, i) => {
              return (
                  <Chat container={i} id={x.receiver_id} chat_id={x.chat_id}
                        socket={socket} key={x.receiver_id}
                        disableChat={disableChat}/>
              )
          }) : null}
        <Footer />
      </div>
  )
}

export default App;
