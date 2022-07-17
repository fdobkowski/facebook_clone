import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/login_page/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer";
import Protected from "./components/Protected";
import _kc from "./Keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";


function App() {

  return (
      <ReactKeycloakProvider authClient={_kc}>
        <Router>
                <Navbar />
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
