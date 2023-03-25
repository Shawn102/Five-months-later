import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { MyGlobalContext } from "../../Context";
import { CircularStatic } from "../Loading";
import "./seemore.css";
import { RxCross1 } from "react-icons/rx";

const SeeMore = ({ selectedID, options, setSeeMoreModal }) => {
  const { backEndData } = MyGlobalContext();
  const [singleData, setSingleData] = useState([]);
  const { title, date, message } = singleData.length !== 0 && singleData[0];
  useEffect(() => {
    const findExact = backEndData.filter((single) => {
      return selectedID === single._id;
    });
    setSingleData(findExact);
  }, [selectedID]);
//   console.log(singleData);
  return (
    <section className="fixed top-0 left-0 w-screen  min-h-screen flex items-center justify-center seeMore">
      {singleData.length === 0 ? (
        <CircularProgress />
      ) : (
        <article className=" text-white text-center border-2 p-5 relative rounded-md m-3">
          <h1 className=" text-3xl">{title.toUpperCase()}</h1>
          <h3>{new Date(date).toLocaleDateString("en-US", options)}</h3>
          <p className=" text-xl">{message}</p>
          <button
            onClick={() => setSeeMoreModal(false)}
            className="text-white text-2xl absolute top-2 right-4 "
          >
            <RxCross1 />
          </button>
        </article>
      )}
    </section>
  );
};

export default SeeMore;
