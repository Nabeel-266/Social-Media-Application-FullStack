import "./auth.css";
import { useState } from "react";

import SignIn from "../../components/signIn/SignIn";
import SignUp from "../../components/signUp/SignUp";

export default function Auth({ registered }) {
  const [authState, setAuthState] = useState(registered);

  return (
    <div className="authMainContainer">
      <div className="authMainContWrapper">
        <div className="authSubContainer">
          <section className="subContLeft">
            <div className="subContLeftWrapper">
              <h5>Welcome To</h5>
              <h1>Social Vibes</h1>
              <p>Connect the friends and the world around you on #Social Vibes.</p>
            </div>
          </section>

          <section className="subContRight">
            <SignIn authState={authState} setAuthState={setAuthState} />
            <SignUp authState={authState} setAuthState={setAuthState} />
          </section>
        </div>
      </div>
    </div>
  );
}
