import "./online.css";

export default function Online({ user }) {
  const { id, name, picture } = user;

  if (id !== 1) {
    return (
      <li className="eachOnlineFriend">
        <div className="onlineFrndImageDiv">
          <span className="onlineStatus"></span>
          <img src={`/assets/${picture}`} alt="friend" className="onlineFriendImage" />
        </div>
        <span className="onlineFriendName">{name}</span>
      </li>
    );
  }
}
