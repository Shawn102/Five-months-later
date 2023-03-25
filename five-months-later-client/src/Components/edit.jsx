import React, { useState, useEffect } from "react";
import { MyGlobalContext } from "../Context";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const Edit = ({runEdit}) => {
  const {
    isEditModeClicked,
    setIsModeClicked,
    editId,
    OnEditSubmitHandle,
    inputChange,
    setInputs,
    token,
  } = MyGlobalContext();
  // const [data, setData] = useState();
  const { title, date, message } = inputChange;
  const id = editId;

  //   this function will close edit mode
  const closeEditMode = () => {
    setIsModeClicked(false);
  };

  const OnChangeEdit = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputChange, [name]: value });
  };
  //   this for fetching data from backend
  useEffect(() => {

      axios
        .get("http://localhost:5000/content/" + id, {
          headers: { Authorization: token },
          withCredentials: true,
        })
        .then((res) => {
          // console.log(res);
          // console.log(res.data.title);
          if (res.data) {
            setInputs({
              title: res.data.title,
              date: res.data.date.slice(0, 16),
              message: res.data.message,
            });
          }
        });
  }, [runEdit]);

  return (
    <section
      className={`${
        isEditModeClicked ? "section-edit show-section-edit" : "section-edit"
      }`}
    >
      <div className="button-ed-div">
        <button onClick={closeEditMode} className="border-none-edit-b">
          <RxCross2 />
        </button>
      </div>
      <form onSubmit={OnEditSubmitHandle} className="FormTodos">
        <h1>Edit your content</h1>
        <div className="form-input-titDate">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={OnChangeEdit}
          />
          <input
            type="datetime-local"
            name="date"
            value={date}
            onChange={OnChangeEdit}
          />
        </div>
        <textarea
          name="message"
          placeholder="Your notes...."
          cols="20"
          rows="5"
          value={message}
          onChange={OnChangeEdit}
          className="textArea"
        />
        <div className="formButton">
          <button type="submit">Edit</button>
        </div>
      </form>
    </section>
  );
};

export default Edit;
