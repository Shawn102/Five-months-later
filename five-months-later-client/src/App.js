import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Todos from "./pages/todos";
import Add from "./pages/add/add";
import Singlecontent from "./pages/singlecontent";
import Signup from "./pages/signin-signup/Signup";
import Signin from "./pages/signin-signup/Signin";
import Error from "./pages/error";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularStatic } from "./Components/Loading";
import { MyGlobalContext } from "./Context";

function App() {
  const { token } = MyGlobalContext();
  const [fullPageLoading, setFullPageLoading] = useState(true);
  useEffect(() => {
    const auto = setTimeout(() => {
      setFullPageLoading(false);
    }, 1200);
    return () => {
      clearTimeout(auto);
    };
  }, []);
  return (
    <div className="App">
      {fullPageLoading ? (
        <CircularStatic />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Signup />
              </>
            }
          />
          {token.length !== 0 ? (
            <>
              <Route
                path="/todos"
                element={
                  <>
                    <Navbar />
                    <Todos />
                  </>
                }
              />
              <Route path="/add" element={<Add />} />
              {/* <Route
                path="/singlecontent/:id"
                element={
                  <>
                    <Navbar />
                    <Singlecontent />
                  </>
                }
              /> */}
            </>
          ) : (
            <>
              <Route
                path="/signin"
                element={
                  <>
                    <Navbar />
                    <Signin />
                  </>
                }
              />
            </>
          )}
          <Route path="*" element={<Error />} />
        </Routes>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
