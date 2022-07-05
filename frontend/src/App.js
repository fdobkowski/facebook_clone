import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/login_page/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

function App() {

    const [cookies, setCookies, removeCookies] = useCookies(['user'])

    useEffect(() => {
        removeCookies('profile_id')
    }, [])

  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"/profile/:id"} element={<Profile/>}/>
      </Routes>
        <Footer />
    </Router>
  );
}

export default App;
