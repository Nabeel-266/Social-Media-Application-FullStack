import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

//* Components
import Auth from "./pages/authentication/Auth";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={user ? <Home /> : <Auth registered={true} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Auth registered={true} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Auth registered={false} />}
        />
        <Route
          path="/profile/:username"
          element={user ? <Profile /> : <Auth registered={true} />}
        />
      </Routes>
    </Router>
  );
}
