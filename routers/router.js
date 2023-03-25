const express = require("express");
const router = new express.Router();
const { Content } = require("../models/content.model");
const USER = require("../models/userSchema");
const bycrypt = require("bcrypt");
const authenticate = require("../middleware/authenticate");

// my register route
router.post("/register", async (req, res) => {
  const { fname, lname, email, mobile, password, cpassword } = req.body;
  try {
    const findEmail = await USER.findOne({ email: email });
    const findMobile = await USER.findOne({ mobile: mobile });
    if (findEmail) {
      res.status(401).json({ message: "This Email already exist!" });
    } else if (findMobile) {
      res.status(402).json({ message: "This mobile already exist!" });
    } else if (password !== cpassword) {
      res
        .status(403)
        .json({ message: "Password and Cpassword doesn't matched!" });
    } else {
      const soltRound = 10;
      const hspass = await bycrypt.hash(password, soltRound);
      const hsCpass = await bycrypt.hash(cpassword, soltRound);
      // creating new user
      const newUser = new USER({
        fname: fname,
        lname: lname,
        email: email,
        mobile: mobile,
        password: hspass,
        cpassword: hsCpass,
      });
      await newUser.save();
      res.status(201).json("Successfully registered!");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// my user login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await USER.findOne({ email: email });
    if (findUser) {
      const isPasswordMatched = await bycrypt.compare(
        password,
        findUser.password
      );
      // calling the "generateToken" function that defiend inside userSchema, to generate token in this proccess
      const gentoken = await findUser.generateToken();
      res.cookie("Fivemonth", gentoken, {
        expires: new Date(Date.now() + 120000),
        httpOnly: true,
        secure: true,
      });
      if (!isPasswordMatched) {
        res.status(401).json({ message: "Incorrect Password!" });
      } else {
        res
          .status(201)
          .json({ message: "Successfully logged In!", token: findUser.token });
      }
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error! Please try again later." });
  }
});

// my logout route for user Logout
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.token = null;
    await req.rootUser.save();
    res.clearCookie("Fivemonth", { path: "/" });
    res.status(201).json({ message: "Successfully logout!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server  error! Please try again later." });
  }
});

// get user info
router.get("/userinfo", authenticate, async (req, res) => {
  try {
    const findUserInfo = await USER.findOne({ _id: req.userID }).select(
      "fname lname email mobile"
    );
    console.log(findUserInfo);
    res.status(200).json(findUserInfo);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// creating the the first route of my server
router.get("/gettodos", authenticate, async (req, res) => {
  try {
    const findCurrentUser = await USER.findOne({ _id: req.userID }).select(
      "todos"
    );
    res.status(201).json(findCurrentUser);
  } catch (error) {
    res.status(401).json({ message: "No data found! related to this user!" });
  }
});
// creating the adding route for adding "Content" to DB and handle the front-end request
router.post("/add", authenticate, async (req, res) => {
  try {
    const findUser = await USER.findOne({ _id: req.userID });
    if (findUser) {
      const inputOnChange = req.body;
      //   console.log(inputOnChange);
      const newTodo = new Content(inputOnChange);
      findUser.todos.push(newTodo);
      await findUser.save();
      res
        .status(201)
        .json({ message: "Successfully content added to DB!", data: newTodo });
    } else {
      res
        .status(404)
        .json({ message: "User not found! Cann't add your todos!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// Single Content data send
router.get("/content/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const findUser = await USER.findOne({ _id: req.userID });
    if (findUser) {
      const content = findUser.todos.id(id);
      if (content) {
        res.status(201).json(content);
      }
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.delete("/delete/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    // console.log(id);
    // console.log("getting headers: " + req.headers);
    const findUser = await USER.findOne({ _id: req.userID });
    if (findUser) {
      const updateUser = await USER.findOneAndUpdate(
        { _id: req.userID },
        { $pull: { todos: { _id: id } } },
        { new: true }
      );
      res.status(201).json("Successfully deleted!");
    } else {
      res
        .status(402)
        .json("Unknown error occured when trying to delete the item!");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
});

// this route for editing
router.post("/update/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const inputChange = req.body;
  const { title, date, message } = inputChange;
  // console.log(inputChange);
  // console.log(id);
  try {
    const findUser = await USER.findOne({ _id: req.userID });
    if (findUser) {
      const updateItem = await USER.findOneAndUpdate(
        { _id: req.userID, "todos._id": id },
        { $set: { "todos.$": inputChange } },
        { new: true }
      );
      // console.log(updateItem);
      res.status(201).json({ message: "Content updated" });
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// this route for post public story of user
router.post("/user/story/share", authenticate, async (req, res) => {
  const { title, date, story } = req.body;
  try {
    const FindExactUser = await USER.findOne({ _id: req.userID });
    if (FindExactUser) {
      FindExactUser.shortstory.story.title = title;
      FindExactUser.shortstory.story.date = date;
      FindExactUser.shortstory.story.sto = story;
      await FindExactUser.save();
      res.status(201).json({ message: "Successfully added your story!" });
    } else {
      res
        .status(404)
        .json({ message: "User not found! Sorry can't set your story" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// getting all the user story
router.get("/get/user/story", async (req, res) => {
  try {
    const findUserStory = await USER.find({ shortstory: { $ne: null } }).select(
      "lname shortstory"
    );
    res.status(200).json(findUserStory);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
