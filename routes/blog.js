const express = require("express");
const router = express.Router();
const Blog=require("../models/blog.js");

//home page
router.get("/", (req, res) => {
  res.render("home", { title: "home" });
});

//all blogs
router.get("/blogs", async(req, res) => {
  try{
    const blogs=await Blog.find().sort({createdAt:-1}).lean();
    
    res.render("blogs", { title: "Blogs" ,
      blogs,
    });
  } catch (error){
    console.error(error);
    res.status(500).send("Error Fetching blogs");
  }
});



//blogs by slug
router.get("/blogs/:slug", async(req, res) => {
  try{
    const post = await Blog.findOne({slug:req.params.slug}).lean(); // <-- add .lean()
    if(!post){
      return res.status(404).send("Blog not found");
    }
    res.render("blogPost", { title: post.title, post });
  } catch(error){
    console.error(error);
    res.status(500).send("Error Fetching blog");
  }
});


// write blog
router.get("/write-blog",(req,res)=>{
  res.render("writeBlog",{title:"Add Your Thought !"})
});

//submitting any blog
router.post("/blogs/new", async (req, res) => {
  try {
    const { title, description, content, tags, social_image, url } = req.body;

    const slug = title.toLowerCase().replace(/ /g, "-");

    const blog = new Blog({
      title,
      description,
      content,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      social_image,
      slug,
      url,  // <-- save URL if provided
    });

    await blog.save();
    const urBlog = await Blog.findOne({ slug }).lean();
    res.render("submission", { title: "Blog Published!", urBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in publishing: " + error.message);
  }
});


//about
router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});



module.exports = router;
