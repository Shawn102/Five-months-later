import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { MyGlobalContext } from "../../Context";

const Signin = () => {
 const {setIsNavOpen, setRunToken} = MyGlobalContext();
 const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);

  const { email, password } = inputData;

  const toggleLoginPassword = () => {
    setIsLoginPasswordVisible(!isLoginPasswordVisible);
  };

  const adddata = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const onSubmitHandle = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Please fill all the inputs!", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      axios
        .post(
          "http://localhost:5000/login",
          { email, password },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 201) {
            // console.log(res);
            localStorage.setItem("FiveMonthToken", res.data.token);
            setRunToken(1);
            toast.success("Successfully login!", {
              position: "top-center",
              autoClose: 2000,
            });
            setInputData({
                email: "",
                password: "",
              });
                navigate("/todos");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response) {
            const status = err.response.status;
            const message = err.response.data.message;
            if (status === 401) {
              toast.warn(message, { position: "top-center", autoClose: 2000 });
            } else if (status === 404) {
              toast.warn(message, { position: "top-center", autoClose: 2000 });
            } else {
              toast.warn(message, { position: "top-center", autoClose: 2000 });
            }
          }
        });
    }
  };
  return (
    <section onClick={() => setIsNavOpen(false)} className="section-signin-signup">
      <div className="sign_container">
        <div className="sign_header">
          <img src="" alt="" />
        </div>
        <div className="sign_form">
          <form onSubmit={onSubmitHandle}>
            <h1>Sign-In</h1>
            <div className="form_data">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={adddata}
                id="email"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input
                type={`${isLoginPasswordVisible ? "text" : "password"}`}
                name="password"
                value={password}
                onChange={adddata}
                id="password"
                placeholder="At least 6 characters"
                autoComplete="off"
              />
              <p onClick={toggleLoginPassword} className="posab-eye-icon">
                {isLoginPasswordVisible ? (
                  <AiFillEye />
                ) : (
                  <AiFillEyeInvisible />
                )}
              </p>
            </div>
            <button type="submit" className="signin_btn">
              Login
            </button>
          </form>
        </div>
        <div className="create_accountinfo">
          <p>New to 5M?</p>
          <button>
            <Link to="/register">Create your 5M account</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Signin;
