const express = require("express");
const router = express.Router();
const path = require("path");
const blogs = require("../data/blogs.js");

router.get("/", (req, res) => {
  res.render("home", { title: "home" });
});
router.get("/blogs", (req, res) => {
  res.render("blogs", { title: "Blogs" ,
    blogs:blogs,
  });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});
router.get("/blogs/:slug", (req, res) => {
  const post = blogs.find((e) => e.slug === req.params.slug);
  res.render("blogPost", { title: post.title, postTitle: post.title });
});

router.get("/write-blog",(req,res)=>{
  res.render("writeBlog",{title:"Add Your Thought !"})
})

module.exports = router;
