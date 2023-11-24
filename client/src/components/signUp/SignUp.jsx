import "./signUp.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

export default function SignUp({ authState, setAuthState }) {
  const navigate = useNavigate();
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const dateOfBirth = useRef();
  const gender = useRef();

  // Register Submission
  const registerSubmission = async (e) => {
    e.preventDefault();

    // For Unique Username
    const randomNumber = Math.floor(1000 + Math.random() * Math.random() * 9000);
    const username = `@${firstName.current.value.toLocaleLowerCase()}${lastName.current.value.toLocaleLowerCase()}${randomNumber}`;

    // For Firstname
    const firstname =
      firstName.current.value.charAt(0).toLocaleUpperCase() +
      firstName.current.value.slice(1).toLocaleLowerCase();

    // For Lastname
    const lastname =
      lastName.current.value.charAt(0).toLocaleUpperCase() +
      lastName.current.value.slice(1).toLocaleLowerCase();

    if (password.current.value === confirmPassword.current.value) {
      setIsPasswordMatch(true);

      const user = {
        userName: username.trim(),
        firstName: firstname.trim(),
        lastName: lastname.trim(),
        email: email.current.value.trim(),
        password: password.current.value,
        birthDate: dateOfBirth.current.value,
        gender: gender.current.value,
      };

      try {
        await axios.post("/auth/register", user);
        navigate("/login");
        setAuthState(true);
      } catch (error) {
        console.error(`Something went wrong on Register, ${error}`);
      }
    } else {
      setIsPasswordMatch(false);
      alert("Password doesn't match");
    }
  };

  return (
    <div
      className="signUpArea"
      style={
        authState
          ? { transform: "translateX(105%)", transition: "0.5s" }
          : { transform: "translateX(0%)", transition: "0.5s" }
      }>
      <header className="signUpHdr">
        <h2>Sign Up</h2>
      </header>

      <form className="signUpForm" onSubmit={(e) => registerSubmission(e)}>
        <fieldset className="formFieldset">
          <div className="nameFields">
            <input
              type="text"
              name="firstName"
              id="firstName"
              ref={firstName}
              placeholder="First Name"
              autoComplete="off"
              required
            />
            <input
              type="text"
              name="lastName"
              id="lastName"
              ref={lastName}
              placeholder="Last Name"
              autoComplete="off"
              required
            />
          </div>

          <div className="emailField">
            <input
              type="email"
              name="email"
              id="email"
              ref={email}
              placeholder="Email Address"
              autoComplete="off"
              required
            />
          </div>

          <div className="passwordFields">
            <input
              type="password"
              name="password"
              id="password"
              ref={password}
              placeholder="Password"
              minLength={8}
              required
              style={
                isPasswordMatch
                  ? { borderBottom: "2px solid #888" }
                  : { borderBottom: "2px solid #b60000" }
              }
            />
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              ref={confirmPassword}
              placeholder="Confirm Password"
              minLength={8}
              required
              style={
                isPasswordMatch
                  ? { borderBottom: "2px solid #888" }
                  : { borderBottom: "2px solid #b60000" }
              }
            />
          </div>

          <div className="otherFields">
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              ref={dateOfBirth}
              required
            />

            <select name="gender" id="gender" ref={gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </fieldset>

        <button type="submit" className="SignUpBtn">
          Register
        </button>
      </form>

      <footer className="signInSuggestion">
        <p>
          If you have already an account?{" "}
          <span
            onClick={() => {
              setAuthState(true);
              navigate("/login");
            }}>
            Sign In
          </span>
        </p>
      </footer>
    </div>
  );
}
