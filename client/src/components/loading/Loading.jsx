import "./loading.css";

export default function Loading() {
  return (
    <div className="loadingArea">
      <div className="loadingCircles">
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
        <div className="circle">
          <div className="dot"></div>
          <div className="outline"></div>
        </div>
      </div>
    </div>
  );
}
