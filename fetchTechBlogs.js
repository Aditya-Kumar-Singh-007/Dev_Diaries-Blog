require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

// ✅ Connect to MongoDB Atlas (from .env)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  slug: String,
  social_image: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// ✅ Fetch blogs
async function fetchBlogs() {
  try {
    // Clear existing blogs first
    // await Blog.deleteMany({});
    // console.log("🗑️ Cleared existing blogs from MongoDB");

    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "technology OR AI OR software OR web development",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY, // ✅ from .env
      },
    });

    const articles = res.data.articles.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      slug: a.title
        ? a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "no-title",
      social_image:
        a.urlToImage && /\.(jpg|jpeg|png|webp)$/i.test(a.urlToImage)
          ? a.urlToImage
          : "/blogdefault.jpg",
    }));

    await Blog.insertMany(articles);
    console.log("✅ Blogs inserted successfully into MongoDB Atlas!");
  } catch (err) {
    console.error(
      "❌ Error fetching or saving blogs:",
      err.response?.data || err.message
    );
  } finally {
    mongoose.connection.close();
  }
}

fetchBlogs();
