import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyGlobalContext } from "../../Context";
import { ImCross } from "react-icons/im";
import backGroundImage from "../../images/addpagetwo.jpeg";
import AddStory from "./AddStory";
import "./add.css";
import { useNavigate } from "react-router-dom";
const Add = () => {
  const {
    inputsOnChange,
    OnChangeHandle,
    OnSubmitHandle,
    formMessages,
    setFormMessages,
    setIsNavOpen,
  } = MyGlobalContext();
  const { title, date, message } = inputsOnChange;
  const navigate = useNavigate();
  const [isStoyTrue, setIsStoryTrue] = useState(false);

  // this useEffect for setting the confirmation message to empty
  useEffect(() => {
    const useingSetTimeOUt = setTimeout(() => {
      setFormMessages("");
    }, 5000);
    return () => clearTimeout(useingSetTimeOUt);
  }, [OnSubmitHandle]);
  return (
    <div className="add-form">
      <img src={backGroundImage} alt="" />
      <div className="pos-form">
        <form
          onSubmit={(event) => {
            OnSubmitHandle(event, navigate);
          }}
          className="FormTodos"
        >
          <h1>Add your content</h1>
          <div className="form-input-titDate">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={title}
              onChange={OnChangeHandle}
            />
            <input
              type="datetime-local"
              name="date"
              value={date}
              onChange={OnChangeHandle}
            />
          </div>
          <textarea
            name="message"
            placeholder="Your notes...."
            cols="20"
            rows="5"
            value={message}
            onChange={OnChangeHandle}
            className="textArea"
          />
          <div className="formButton">
            <button type="submit">Submit</button>
          </div>
        </form>
        <div className=" flex justify-center flex-wrap my-5">
        <Link to="/todos">
          <button
            onClick={() => {
              setIsNavOpen(false);
            }}
            className="fourZeroFour m-2"
          >
            Back to previous page
          </button>
        </Link>  
        <button onClick={() => setIsStoryTrue(true)}
            className="fourZeroFour m-2"
          >
            Share Your Story
          </button>
        </div>
      </div>
      <div
        className={`${
          formMessages !== "" ? "hAbsolute showAddPopSuccess" : "hAbsolute"
        }`}
      >
        <div className="inside-success-add">
          <p>{formMessages}</p>
          <button onClick={() => setFormMessages("")}>
            <ImCross />
          </button>
        </div>
      </div>
      <AddStory isStoyTrue={isStoyTrue} setIsStoryTrue={setIsStoryTrue}/>
    </div>
  );
};
export default Add;
