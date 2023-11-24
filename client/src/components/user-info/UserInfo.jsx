import "./userInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//* Material Icons
import {
  CalendarMonthRounded,
  FavoriteRounded,
  MapsHomeWorkRounded,
  LocationOnRounded,
  AccessTimeRounded,
} from "@mui/icons-material";

export default function UserInfo({ user }) {
  const { _id, birthDate, relationship, city, from, createdAt, followings } = user;
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(`/user/${_id}/friends`);
        // console.log(response.data.data);
        setFriends(response.data.data);
      } catch (error) {
        console.error("Something went wrong " + error.message);
      }
    };
    if (_id && followings?.length) {
      getFriends();
    }
  }, [_id, followings]);

  const monthsName = [
    "Januray",
    "Februray",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // For Joined Date
  const splittedCreatedAt = new Date(createdAt).toLocaleDateString().split("/");
  const formattedJoinedDate = `${monthsName[splittedCreatedAt?.[0] - 1]}, ${
    splittedCreatedAt?.[2]
  }`;

  // For Birth Date
  const splittedBirthDate = birthDate?.split("-");
  const dateOfBirth = `${monthsName[splittedBirthDate?.[1] - 1]}, ${
    splittedBirthDate?.[0]
  }`;

  return (
    <aside className="userInfo">
      <div className="intro">
        <h3>Intro</h3>

        <span>
          <CalendarMonthRounded className="introIcon" /> Born in
          <strong>{dateOfBirth}</strong>
        </span>

        <span style={relationship ? { display: "flex" } : { display: "none" }}>
          <FavoriteRounded className="introIcon" /> Relation
          <strong>{relationship || "Single"}</strong>
        </span>

        <span style={city ? { display: "flex" } : { display: "none" }}>
          <MapsHomeWorkRounded className="introIcon" /> Lives in
          <strong>{city || "Berlin, Germany"}</strong>
        </span>

        <span style={from ? { display: "flex" } : { display: "none" }}>
          <LocationOnRounded className="introIcon" /> From
          <strong>{from || "Karachi, Pakistan"}</strong>
        </span>

        <span>
          <AccessTimeRounded className="introIcon" /> Joined
          <strong>{formattedJoinedDate}</strong>
        </span>
      </div>

      <div
        className="friends"
        style={followings?.length ? { display: "flex" } : { display: "none" }}>
        <div className="friendHeading">
          <h3>Friends</h3>
          <span>{friends.length}</span>
        </div>

        <div className="friendsArea">
          {friends.map((friend, index) => {
            return <EachFriend key={index} friend={friend} />;
          })}
        </div>
      </div>
    </aside>
  );
}

function EachFriend({ friend }) {
  const { userName, firstName, lastName, profilePicture } = friend;

  return (
    <Link to={`/profile/${userName?.slice(1)}`} style={{ textDecoration: "none" }}>
      <div className="eachFriend">
        <img src={profilePicture || "/assets/no-profile-image.jpg"} alt="Friend" />
        <span>{`${firstName} ${lastName}`}</span>
      </div>
    </Link>
  );
}
