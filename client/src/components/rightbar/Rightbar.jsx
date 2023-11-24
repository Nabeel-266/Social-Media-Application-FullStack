import "./rightbar.css";
import { allUsers } from "../../dummydata";
import Online from "../online/Online";

export default function Rightbar() {
  return (
    <aside className="rightbar">
      <div className="rightbarWrapper">
        <section className="advertisementCont">
          <img
            src={`/assets/advertisement.jpg`}
            alt="advertisement"
            className="advertisementImage"
          />
        </section>

        <section className="birthdayCont">
          <header className="birthdayHeader">
            <h3>Birthday</h3>
          </header>

          <div className="birthdayContent">
            <img src="/assets/birthday.png" alt="birthday" className="birthdayImage" />
            <span className="birthdayText">
              <strong>Zakir Khan</strong> and <strong>2 other friends</strong> have a
              birthday today
            </span>
          </div>
        </section>

        <section className="onlineFriend">
          <header className="onlineFriendHdr">
            <h3>Online Friends</h3>
          </header>

          <ul className="onlineFriendList">
            {allUsers.map((user) => {
              return <Online key={user.id} user={user} />;
            })}
          </ul>
        </section>
      </div>
    </aside>
  );
}
