import { Divider } from "@mui/material";
import React from "react";
import { RecipeReviewCard } from "./Mui";
import "./home.css";
import { MyGlobalContext } from "../../Context";
import { Link } from "react-router-dom";

const Homemain = () => {
  const { token } = MyGlobalContext();
  return (
    <section className="flex px-3 py-3 md:px-20 justify-center flex-wrap h-full">
      <article className="w-65 md:pt-16 md:min-h-screen text-center md:flex-none md:w-2/5  p-2 md:text-start md:pl-1">
        <h1 className="text-blue-900 font-bold md:text-4xl py-2 title-home-same">
          Life Easier With 5M
        </h1>
        <h3 className="font-bold text-white text-4xl pb-5 tracking-wide home-title-todo">
          TODO APP
        </h3>
        <p className="text-justify text-white font-medium  md:pr-3">
          5M is simple todo app, it can helps you more focus, either work or
          play! Make a plan or list of resolutions to achieve goals or achieve
          success.
        </p>
        <Link to={`${token.length !== 0 ? "/todos" : "/signin"}`}>
          <button className="bg-red-500 hover:bg-red-900 text-white font-bold active:bg-red-700 focus: outline-none py-2 px-5 rounded-lg my-2 md:my-5">
            Get started
          </button>
        </Link>
      </article>
      <article className="p-2 md:pt-16 md:w-3/5 md:pl-32">
        <h3 className="font-bold text-blue-900 md:text-3xl text-center md:text-start title-home-same">
          Our users story
        </h3>
        <Divider style={{ marginBottom: "10px" }} />
        <RecipeReviewCard />
      </article>
    </section>
  );
};

export default Homemain;
