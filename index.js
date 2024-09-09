const express = require("express");
const { default: mongoose } = require("mongoose");
const Blog = require("./model/blogModel");
const cors = require("cors");
require("dotenv").config();
const app = express();

// node js lai form bata aako data parse gar bhaneko ho
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected Successfully");
  })
  .catch(() => {
    console.log(" MongoDB connection failed");
  });

// GET API

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// GET API => /blogs(All blogs)

app.get("/blogs", async (req, res) => {
  // fetching/reading all blogs from blog model
  const blogs = await Blog.find();
  if (blogs.length == 0) {
    res.status(404).json({
      message: "Empty Blogs",
    });
  } else {
    res.status(200).json({
      message: "Blogs fetched Successfully",
      data: blogs,
    });
  }
});

//GET API => /blogs/:id (single blogs)

app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (blog) {
      res.status(200).json({
        message: "Single Blog Fetched Successfully",
        data: blog,
      });
    } else {
      res.status(404).json({
        message: "No blog Found with that ID",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "No blog Found With that ID",
      error: error.message,
    });
  }
});
// Create Blog API
app.post("/createBlog", async (req, res) => {
  console.log(req.body);
  const { title, subTitle, description } = req.body;

  //Insert into database logic--- model lai bolauna paryo
  await Blog.create({
    title: title,
    subTitle: subTitle,
    description: description,
  });

  res.json({
    status: 200,
    message: "Blog created Successfully",
  });
});

// single chij edit garna paryo bhane...Edit blog

app.patch("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const subTitle = req.body.subTitle;
  const description = req.body.description;

  // const {title,subTitle,description} = req.body  ALTERNATIVE

  await Blog.findByIdAndUpdate(id, {
    title: title,
    subTitle: subTitle,
    description: description,
  });

  res.status(200).json({
    message: "Blog updated Succesfully",
  });
});
// sabai ekaichoti edit garna paryo bhaney

app.put("/blogs/:id", async (req, res) => {
  const { title, subTitle, description } = req.body;
  const { id } = req.params;

  try {
    await Blog.findByIdAndUpdate(id, {
      title: title,
      subTitle: subTitle,
      description: description,
    });

    res.status(200).json({
      message: "All fields are edited successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating blog",
      error: error.message,
    });
  }
});

// delete
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  await Blog.findByIdAndDelete(id);
  res.status(200).json({
    message: "Blog deleted successfully",
  });
});
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});

module.exports = app;
