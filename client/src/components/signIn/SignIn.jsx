import "./signIn.css";
import { useNavigate } from "react-router-dom";
import { useRef, useContext } from "react";
import { loginCall } from "../../apiCall";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function SignIn({ authState, setAuthState }) {
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  // Login Submission
  const loginSubmission = async (e) => {
    e.preventDefault();

    const userCredential = {
      email: email.current.value,
      password: password.current.value,
    };

    try {
      await loginCall(userCredential, dispatch);
    } catch (error) {
      console.error("Something went wrong on Login" + error);
    }

    email.current.value = "";
    password.current.value = "";
  };

  return (
    <div
      className="signInArea"
      style={
        authState
          ? { transform: "translateX(0%)", transition: "0.5s" }
          : { transform: "translateX(105%)", transition: "0.5s" }
      }>
      <header className="signInHdr">
        <h2>Sign In</h2>
      </header>

      <form className="signInForm" onSubmit={(e) => loginSubmission(e)}>
        <fieldset className="formFieldset">
          <div className="loginEmailField">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="loginEmail"
              id="loginEmail"
              placeholder="Email Address"
              autoComplete="off"
              ref={email}
              required
              style={
                error?.response?.data.message !== "User not Found"
                  ? { border: "2px solid #888" }
                  : { border: "2px solid #b60000" }
              }
            />
          </div>

          <div className="loginPasswordField">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="loginPassword"
              id="loginPassword"
              placeholder="Password"
              minLength={8}
              ref={password}
              required
              style={
                error?.response?.data.message !== "Wrong Password"
                  ? { border: "2px solid #888" }
                  : { border: "2px solid #b60000" }
              }
            />
          </div>
        </fieldset>

        <button type="submit" className="SignInBtn" disabled={isFetching}>
          {isFetching ? (
            <CircularProgress style={{ color: "#fff", marginTop: "2px" }} size="20px" />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <span className="forgotPassword">Forgotten Password?</span>

      <footer className="signUpSuggestion">
        <p>
          If you don't have an account?{" "}
          <span
            onClick={() => {
              setAuthState(false);
              navigate("/register");
            }}>
            Sign Up
          </span>
        </p>
      </footer>
    </div>
  );
}
