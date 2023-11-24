import "./sidebar.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

//* Component
import User from "../sidebar-user/User";

// * Material Icons
import {
  DynamicFeedRounded,
  MessageRounded,
  NotificationsRounded,
  PlayCircleFilledRounded,
  GroupsRounded,
  BookmarkRounded,
  EventRounded,
  WorkRounded,
  KeyboardArrowDownRounded,
  //   KeyboardArrowUpRounded
} from "@mui/icons-material";

export default function Sidebar() {
  const [allUsers, setAllUsers] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/all");
        setAllUsers(response.data.data);
      } catch (error) {
        console.error("Something went wrong " + error.message);
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <section className="sidebar">
      <div className="sidebarWrapper">
        <nav className="sidebarNavigators">
          <ul className="navigatorsList">
            <li className="navigatorItem">
              <DynamicFeedRounded className="navigatorIcon" />
              <span className="navigatorText">Feeds</span>
            </li>

            <li className="navigatorItem">
              <MessageRounded className="navigatorIcon" />
              <span className="navigatorText">Chats</span>
            </li>

            <li className="navigatorItem">
              <PlayCircleFilledRounded className="navigatorIcon" />
              <span className="navigatorText">Videos</span>
            </li>

            <li className="navigatorItem">
              <GroupsRounded className="navigatorIcon" />
              <span className="navigatorText">Groups</span>
            </li>

            <li className="navigatorItem">
              <BookmarkRounded className="navigatorIcon" />
              <span className="navigatorText">Bookmarks</span>
            </li>

            <li className="navigatorItem">
              <NotificationsRounded className="navigatorIcon" />
              <span className="navigatorText">Notifications</span>
            </li>

            <li className="navigatorItem">
              <EventRounded className="navigatorIcon" />
              <span className="navigatorText">Events</span>
            </li>

            <li className="navigatorItem">
              <WorkRounded className="navigatorIcon" />
              <span className="navigatorText">Jobs</span>
            </li>
          </ul>

          <button className="seeNavigatorsBtn">
            <KeyboardArrowDownRounded className="btnIcon" />
            {/* <KeyboardArrowUpRounded className="btnIcon" /> */}
            See More
          </button>
        </nav>

        <section className="sidebarUsers">
          <header className="sidebarUserHdr">
            <h2>Friend Suggestions</h2>
          </header>
          <ul className="usersList">
            {allUsers.map((user, index) => {
              return <User key={index} user={user} />;
            })}
          </ul>
        </section>
      </div>
    </section>
  );
}
