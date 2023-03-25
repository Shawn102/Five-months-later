import React from "react";
import { Link } from "react-router-dom";
import errorImage from "../images/errorpage.jpg";

const Error = () => {
  return (
    <>
      <div className="imagebox">
        <img src={errorImage} alt="" />
        <div className="errorPageHeading">
          <div>
            <h3>Unexpected error </h3>
            <h1>
              404
            </h1>
            <h5>Page not found</h5>
            <Link to="/" className="button-links">
              <button className="fourZeroFour">Back to Home</button>
            </Link>
            <p>@{new Date().getFullYear()} all rights reserved by Shawn</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
