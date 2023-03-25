import React, { useState, useEffect } from "react";
import { MyGlobalContext } from "../Context";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import PopUp from "../Components/PopUp";
import { Link, useNavigate } from "react-router-dom";
import Edit from "../Components/edit";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import SeeMore from "../Components/TodosSeeMore/SeeMore";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "./todos.css";

const CircularUnderLoad = () => {
  return (
    <CircularProgress
      disableShrink
      sx={{ color: "white", marginLeft: "22px" }}
    />
  );
};

const Todos = () => {
  const {
    backEndData,
    setBackEndData,
    isLoading,
    setIsLoading,
    deleteData,
    setIsModeClicked,
    setEditId,
    setIsNavOpen,
    runAfterEdit,
    token,
    runDelete,
  } = MyGlobalContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState([]);
  const [userLoadin, setUserLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedID, setSelectedID] = useState("");
  const [runEdit, setRunEdit] = useState(0);
  const [seeMoreModal, setSeeMoreModal] = useState(false);
  // console.log(userInfo);
  // console.log(backEndData);

  const calculateRunEdit = () => {
    setRunEdit((previous) => {
      return previous + 1;
    });
  };

  // console.log(backEndData && backEndData[0]?._id);

  //   this for open popup individually for each child component of the array data
  const toggleModal = (clickedId) => {
    setModal(true);
    setSelectedID(clickedId);
  };

  // This function opening edit mode
  const OpenEditMode = (id) => {
    setIsModeClicked(true);
    setEditId(id);
  };

  // this for foramting the date and time(making it user friendly)
  let options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  // this for collecting user data from backend
  const getUserInfo = async () => {
    setUserLoading(true);
    axios
      .get("http://localhost:5000/userinfo", {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setUserInfo(res.data);
          setUserLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.warn("Error occured, shortly we will navigate you to home page!");
        const auto = setTimeout(() => {
          navigate("/");
          setUserLoading(false);
        }, 2000);
        return () => {
          clearTimeout(auto);
        };
      });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // this for collecting todos data from back-end
  const getAllData = async () => {
    setIsLoading(true);
    await axios
      .get("http://localhost:5000/gettodos", {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data) {
          setBackEndData(res.data.todos);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllData();
  }, [runAfterEdit, runDelete]);

  return (
    <>
      <div onClick={() => setIsNavOpen(false)} className="home-page-content">
        {userLoadin ? (
          <section className="profile-section">
            <h2 className="font-bold">Personal Info</h2>
            <article className="box-container-model  flex items-center justify-center px-1">
              <h1 className="font-bold text-white text-2xl text-center">
                User Info Loading.....
              </h1>
            </article>
          </section>
        ) : (
          <section className="profile-section">
            <h2 className="text-bold">Personal Info</h2>
            <article className="box-container-model ">
              <Avatar
                className="avtar-personalinfo"
                id="basic-button"
                aria-haspopup="true"
              >
                {userInfo.length !== 0 &&
                  userInfo.lname.slice(0, 1).toUpperCase()}
              </Avatar>
              <h2 className="h4-avatar">{userInfo.fname}</h2>
              <h4 className="h4-avatar last-name">{userInfo.lname}</h4>
              <div className="personal-info-email-phone">
                <span>Email: {userInfo.email}</span>
                <span>Phone: {userInfo.mobile}</span>
              </div>
            </article>
          </section>
        )}
        <h1 className="h1-todos">
          <span style={{ borderBottom: "4px dotted white" }}>Your Todos</span>
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-28">
            <div>
              <CircularUnderLoad />
              <h1 className="text-white font-extrabold tracking-widest ">
                Loading...
              </h1>
            </div>
          </div>
        ) : (
          <>
            {backEndData?.length !== 0 ? (
              <div className="inside-content-map-place">
                {backEndData?.map((values) => {
                  const { _id: id, message, title, date } = values;
                  return (
                    <div key={id} className="style-of-content">
                      <h2>{`${title?.slice(0, 20)}...`}</h2>

                      <h5>
                        {new Date(date).toLocaleDateString("en-US", options)}
                      </h5>
                      <p>{`${message.slice(0, 25)}....`}</p>
                      <div className="buttons-todos-flex">
                        <button
                          onClick={() => {
                            setSeeMoreModal(true);
                            setSelectedID(id);
                          }}
                          className="links single-page"
                        >
                          See More
                        </button>
                        <button
                          onClick={() => {
                            OpenEditMode(id);
                            calculateRunEdit();
                          }}
                          className="button-absolute"
                        >
                          <CiEdit />
                        </button>
                        <button
                          onClick={() => toggleModal(id)}
                          className="button-absolute"
                        >
                          <MdDeleteForever />
                        </button>
                      </div>
                      {modal && id === selectedID && (
                        <PopUp
                          deleteData={deleteData}
                          id={id}
                          title={title}
                          setModal={setModal}
                          setSelectedID={setSelectedID}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <h1>You don't have any content</h1>
            )}
          </>
        )}
      </div>
      <Edit runEdit={runEdit} />
      {seeMoreModal && (
        <SeeMore
          selectedID={selectedID}
          options={options}
          setSeeMoreModal={setSeeMoreModal}
        />
      )}
    </>
  );
};

export default Todos;
