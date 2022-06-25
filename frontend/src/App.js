import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
        <Navbar/>
      <Routes>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"/profile/:id"} element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
