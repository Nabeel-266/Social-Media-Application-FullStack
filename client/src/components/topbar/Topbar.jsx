import "./topbar.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// * Material Icons
import {
  TagRounded,
  SearchRounded,
  HomeRounded,
  ViewTimelineRounded,
  MessageRounded,
  NotificationsRounded,
  PersonRounded,
  PersonOutlineOutlined,
  SettingsRounded,
  LogoutRounded,
} from "@mui/icons-material";

export default function Topbar() {
  const [isOpenAccountOpt, setIsOpenAccountOpt] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { profilePicture, userName } = user;

  const logOutHandler = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="topbar">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="logo">
            <TagRounded className="logoIcon" />
            <span className="logoText">SocialVibes</span>
          </div>
        </Link>
      </div>

      <div className="topbarCenter">
        <div className="searchbar">
          <SearchRounded className="searchIcon" />
          <input
            type="search"
            className="searchInput"
            name="search"
            id="search"
            placeholder="Search Here..."
            autoComplete="off"
          />
        </div>
      </div>

      <div className="topbarRight">
        <nav className="topbarNavigationIcons">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="navIcon">
              <abbr title="Home">
                <HomeRounded className="icon" />
              </abbr>
            </div>
          </Link>

          <div className="navIcon">
            <abbr title="Timeline">
              <ViewTimelineRounded className="icon" />
            </abbr>
          </div>

          <div className="navIcon">
            <abbr title="Chats">
              <MessageRounded className="icon" />
              <span className="badge">99+</span>
            </abbr>
          </div>

          <div className="navIcon">
            <abbr title="Notifications">
              <NotificationsRounded className="icon" />
              <span className="badge">99+</span>
            </abbr>
          </div>

          <div className="navIcon">
            <div
              className="account"
              onClick={() => setIsOpenAccountOpt(!isOpenAccountOpt)}>
              <abbr title="Account">
                {profilePicture ? (
                  <img src={profilePicture} alt="LoginUser" />
                ) : (
                  <PersonRounded className="icon" />
                )}
              </abbr>
            </div>

            {isOpenAccountOpt && (
              <ul className="accountOptions">
                <Link
                  to={`/profile/${userName?.slice(1)}`}
                  style={{ textDecoration: "none" }}>
                  <li
                    className="eachAccountOption"
                    onClick={() => setIsOpenAccountOpt(false)}>
                    <PersonOutlineOutlined className="eachOptIcon" /> Profile
                  </li>
                </Link>
                <li
                  className="eachAccountOption"
                  onClick={() => setIsOpenAccountOpt(false)}>
                  <SettingsRounded className="eachOptIcon" /> Setting
                </li>
                <li
                  className="eachAccountOption"
                  onClick={() => {
                    setIsOpenAccountOpt(false);
                    logOutHandler();
                  }}>
                  <LogoutRounded className="eachOptIcon" /> Log Out
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
