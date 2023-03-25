import axios from "axios";
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyGlobalContext } from "../../Context";

const AddStory = ({ isStoyTrue, setIsStoryTrue }) => {
  const { token, setNewStoryRun } = MyGlobalContext();
  const [storyData, setStoryData] = useState({
    title: "",
    date: "",
    story: "",
  });
  const { title, date, story } = storyData;
  const OnChangeHandle = (e) => {
    const { name, value } = e.target;
    setStoryData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const OnSubmitStory = (e) => {
    e.preventDefault();
    // this for style the "toast"
    const styleOfToast = { position: "top-center", autoClose: 1500 };

    if (!title || !date || !story) {
      toast.warn("All the inputs should be filled!", styleOfToast);
    } else {
      axios
        .post(
          "http://localhost:5000/user/story/share",
          {
            title,
            date,
            story,
          },
          { headers: { Authorization: token }, withCredentials: true }
        )
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message, styleOfToast);
            setStoryData({
              title: "",
              date: "",
              story: "",
            });
            // this for auto update "user story", if any user add story
            setNewStoryRun((prev) => {
              return prev + 1;
            });
            setIsStoryTrue(false);
          }
        })
        .catch((error) => {
          console.log(error);
          const status = error.response.status;
          const message = error.response.data.message;
          if (status === 500) {
            toast.warn(message, styleOfToast);
          } else if (status === 404) {
            toast.warn(message, styleOfToast);
          } else {
            toast.warn(message, styleOfToast);
          }
        });
    }
  };
  return (
    <div
      className={`${
        isStoyTrue
          ? "add-story-div show-story-div absolute top-0 left-0 w-screen h-screen "
          : "add-story-div"
      }`}
    >
      <form onSubmit={OnSubmitStory} className="FormTodos">
        <h1 className="font-bold ">Your Story</h1>
        <div className="form-input-titDate">
          <input
            type="text"
            placeholder="Story title"
            name="title"
            value={title}
            onChange={OnChangeHandle}
          />
          <input
            type="datetime-local"
            value={date}
            name="date"
            onChange={OnChangeHandle}
          />
        </div>
        <textarea
          name="story"
          placeholder="Write your story...."
          value={story}
          onChange={OnChangeHandle}
          cols="20"
          rows="5"
          className="textArea"
        />
        <div className="formButton">
          <button type="submit">Share</button>
        </div>
        <p
          onClick={() => setIsStoryTrue(false)}
          className="text-white  absolute top-16 right-5 md:right-96 text-xl "
        >
          <ImCross />
        </p>
      </form>
    </div>
  );
};

export default AddStory;
