import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import fivem from "../images/fivem.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { MyGlobalContext } from "../Context";

const Navbar = () => {
  const { token, isNavOpen, setIsNavOpen, logout } = MyGlobalContext();
  const navigate = useNavigate();
  const insideContainer = useRef(0);
  const mainContainer = useRef(0);
  useEffect(() => {
    let HeightOfInsideList =
      insideContainer.current.getBoundingClientRect().height;
    if (isNavOpen) {
      mainContainer.current.style.height = `${HeightOfInsideList}px`;
    } else {
      mainContainer.current.style.height = `0px`;
    }
  }, [isNavOpen]);

  // short function of closing nav
  const close = () => {
    setIsNavOpen(false);
  };
  return (
    <nav>
      <div className="responsive-nav">
        <img src={fivem} alt="" className="fivem-logo" />
        <button onClick={() => setIsNavOpen((previous) => !previous)}>
          <FaBars />
        </button>
      </div>
      <div ref={mainContainer} className="nav-links-container">
        <ul ref={insideContainer}>
          <Link to="/" className="links">
            <li onClick={close}>Home</li>
          </Link>
          {token.length !== 0 ? (
            <>
              <Link to="/todos" className="links">
                <li onClick={close}>Todos</li>
              </Link>
              <Link to="/add" className="links">
                <li>Add todos</li>
              </Link>
              <li
                onClick={() => {
                  logout(navigate);
                }}
                className="links"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FiLogOut style={{ marginRight: "5px" }} />
                Logout
              </li>
            </>
          ) : (
            <Link to="/signin" className="links">
              <li onClick={close}>Signin</li>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
