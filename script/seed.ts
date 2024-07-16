import mongoose from "mongoose";
import Blog from "../src/app/models/blog";
import Category from "../src/app/models/category";
import Admin from "../src/app/models/admin";

const mongoUri = process.env.MONGO_URI as string;

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    // Clear existing data
    // await Blog.deleteMany({});
    // await Category.deleteMany({});

    // Create Categories
    const categories = [
      { name: "Technology", description: "All about tech" },
      { name: "Lifestyle", description: "Lifestyle tips" },
      { name: "Travel", description: "Travel stories" },
      { name: "programming", description: "what is programming" },
      { name: "javascript", description: "javascript serverside" },
    ];

    const createdCategories = await Category.insertMany(categories);
    const admin = await Admin.findOne({ userName: "defaultAdmin" });

    // Create Blogs
    const blogs = [
      {
        title: "Tech Trends 2024",
        content: "Latest trends in technology for 2024...",
        category: createdCategories[0]._id,
        author: admin?._id,
      },
      {
        title: "Healthy Living Tips",
        content: "Tips for a healthy lifestyle...",
        category: createdCategories[1]._id,
        author: admin?._id,
      },
      {
        title: "Top Travel Destinations",
        content: "Best places to travel in 2024...",
        category: createdCategories[2]._id,
        author: admin?._id,
      },
    ];

    await Blog.insertMany(blogs);

    console.log("Database seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
