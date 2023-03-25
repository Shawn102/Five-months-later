import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./signin.css";
import axios from "axios";
import { toast } from "react-toastify";
import { MyGlobalContext } from "../../Context";

const Signup = () => {
 const {setIsNavOpen} = MyGlobalContext();
  const navigate = useNavigate();
  const [udata, setUdata] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
  });
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] =
    useState(false);
  const [isRegisterPasswordVisibleTwo, setIsRegisterPasswordVisibleTwo] =
    useState(false);
  const { fname, lname, email, mobile, password, cpassword } = udata;

  const toggleRegisterPassword = () => {
    setIsRegisterPasswordVisible(!isRegisterPasswordVisible);
  };
  const toggleRegisterPasswordTwo = () => {
    setIsRegisterPasswordVisibleTwo(!isRegisterPasswordVisibleTwo);
  };

  const adddata = (e) => {
    const { name, value } = e.target;
    setUdata({ ...udata, [name]: value });
  };
  const senddata = async (e) => {
    e.preventDefault();
    if (!fname || !lname || !email || !mobile || !password || !cpassword) {
      toast.warn("Please fill all the inputs", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      await axios
        .post("http://localhost:5000/register", {
          fname,
          lname,
          email,
          mobile,
          password,
          cpassword,
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success("Successfully registered!", {
              position: "top-center",
              autoClose: 2000,
            });
            navigate("/signin");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            const status = err.response.status;
            const message = err.response.data.message;
            if (status === 401) {
              toast.warn(message, {
                position: "top-center",
                autoClose: 2000,
              });
            } else if (status === 402) {
              toast.warn(message, {
                position: "top-center",
                autoClose: 2000,
              });
            } else if (status === 403) {
              toast.warn(message, {
                position: "top-center",
                autoClose: 2000,
              });
            } else {
              toast.error(message, {
                position: "top-center",
                autoClose: 2000,
              });
            }
          } else {
            toast.error("Failed to register. Please try again later.", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        });
    }
  };
  return (
    <div onClick={() => setIsNavOpen(false)} className="section-signin-signup height-signup">
      <div className="sign_container">
        <div className="sign_header">
          <img src="" alt="" />
        </div>
        <div className="sign_form">
          <form onSubmit={senddata}>
            <h1>Create New Account</h1>
            <div className="form_data">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                onChange={adddata}
                value={fname}
              />
            </div>
            <div className="form_data">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                id="lname"
                onChange={adddata}
                value={lname}
              />
            </div>
            <div className="form_data">
              <label htmlFor="">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={adddata}
                value={email}
              />
            </div>
            <div className="form_data">
              <label htmlFor="mobile">Phone mobile</label>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                onChange={adddata}
                value={mobile}
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type={`${isRegisterPasswordVisible ? "text" : "password"}`}
                name="password"
                id="password"
                onChange={adddata}
                value={password}
                placeholder="At least 6 characters"
                autoComplete="off"
              />
              <p onClick={toggleRegisterPassword} className="posab-eye-icon">
                {isRegisterPasswordVisible ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </p>
            </div>
            <div className="form_data">
              <label htmlFor="cpassword">Confirm Password</label>
              <input
                type={`${isRegisterPasswordVisibleTwo ? "text" : "password"}`}
                name="cpassword"
                id="cpassword"
                onChange={adddata}
                value={cpassword}
                placeholder="At least 6 characters"
                autoComplete="off"
              />
              <p onClick={toggleRegisterPasswordTwo} className="posab-eye-icon">
                {isRegisterPasswordVisibleTwo ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </p>
            </div>
            <button type="submit" className="signin_btn">
              Sign Up
            </button>
            <div className="signin_info">
              <p>
                Already have an account? <Link to="/signin">Signin</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
