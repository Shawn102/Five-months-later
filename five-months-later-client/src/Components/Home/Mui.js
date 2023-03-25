import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
//
import { red } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import SkeletonLoading from "./SkeletonLoadin";
import axios from "axios";
import { toast } from "react-toastify";
import { MyGlobalContext } from "../../Context";

export const RecipeReviewCard = () => {
  const { NewStoryRun } = MyGlobalContext();
  const [storyData, setStoryData] = useState([]);
  const [storyLoading, setStoryLoading] = useState(false);
  const [isFullContent, setIsFullContent] = useState(false);
  const [selectId, setSelectId] = useState("");

  const getStoryData = async () => {
    setStoryLoading(true);
    await axios
      .get("http://localhost:5000/get/user/story")
      .then((res) => {
        if (res.status === 200) {
          setStoryData(res.data);
          console.log(res.data);
          setStoryLoading(false);
        }
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 500) {
          toast.warn(error.response.data.message, {
            position: "top-center",
            autoClose: 1500,
          });
        } else {
          toast.warn(error.response.data.message, {
            position: "top-center",
            autoClose: 1500,
          });
        }
      });
  };

  useEffect(() => {
    getStoryData();
  }, [NewStoryRun]);

  // date format
  const dateFormat = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  // this function for checking which content user want to read
  const toggleFullContent = (selectedID) => {
    setIsFullContent(true);
    setSelectId(selectedID);
  };

  return (
    <>
      {storyLoading ? (
        <SkeletonLoading />
      ) : (
        <div className="md:flex md:flex-wrap md:justify-center custom-card-home">
          {storyData.length !== 0 ? (
            storyData.map((singleUser) => {
              // destructuring the "singleUser" object
              const {
                lname,
                _id,
                shortstory: {
                  story: { date, sto, title },
                },
              } = singleUser;
              return (
                <Card
                  key={_id}
                  sx={{
                    // width: "100%",
                    // maxWidth: 240,
                    background: "rgba(255, 255, 255,0.7)",
                  }}
                  className="m-1 card-story-class-size"
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {lname.substring(0, 1).toUpperCase()}
                      </Avatar>
                    }
                    title={title}
                    subheader={new Date().toLocaleDateString(
                      "en-US",
                      dateFormat
                    )}
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        height: 60,
                        textAlign: "justify",
                        paddingBottom: "10px",
                      }}
                      className={`${
                        isFullContent && _id === selectId
                          ? "overflow-y-auto"
                          : ""
                      }`}
                    >
                      {`${
                        isFullContent && _id === selectId
                          ? sto
                          : `${sto.substring(0, 30)}.....`
                      }`}
                      <button className=" border-b-2 border-b-blue-900 rounded-2xl py-0.5 px-2 text-blue-900 hover:transition-all hover:border-b-white hover:text-white hover:backdrop-brightness-50 hover:shadow-lg hover:shadow-blue-500/50">
                        {isFullContent && _id === selectId ? (
                          <span onClick={() => setIsFullContent(false)}>
                            See Less
                          </span>
                        ) : (
                          <span onClick={() => toggleFullContent(_id)}>
                            Read More
                          </span>
                        )}
                      </button>
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div>
              <h1>No user story added yet!</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};
