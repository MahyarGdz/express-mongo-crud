import mongoose from "mongoose";
import slugify from "slugify";
import Blog from "../src/app/models/blog";
import Category from "../src/app/models/category";
import Admin from "../src/app/models/admin";

// Ensure the `Role` model is registered
import Role from "../src/app/models/role";
console.log(Role);

const mongoUri = process.env.MONGO_URI as string;

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Blog.deleteMany({});
    await Category.deleteMany({});

    // Create Categories
    const categories = [
      { name: "JavaScript", description: "All about JavaScript", slug: "javascript" },
      { name: "Python", description: "All about Python", slug: "python" },
      { name: "Java", description: "All about Java", slug: "java" },
      { name: "C++", description: "All about C++", slug: "c-plus-plus" },
      { name: "Ruby", description: "All about Ruby", slug: "ruby" },
      { name: "Go", description: "All about Go", slug: "go" },
      { name: "Swift", description: "All about Swift", slug: "swift" },
      { name: "PHP", description: "All about PHP", slug: "php" },
      { name: "C#", description: "All about C#", slug: "c-sharp" },
      { name: "Rust", description: "All about Rust", slug: "rust" },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log("Categories seeded");

    const admin = await Admin.findOne({ userName: "defaultAdmin" });

    // Create Blogs
    const blogs = [
      {
        title: "Deep Dive into JavaScript",
        content: "JavaScript is a versatile language...",
        category: createdCategories[0]._id,
        author: admin?._id,
        slug: slugify("Deep Dive into JavaScript", { lower: true }),
      },
      {
        title: "Exploring Python for Data Science",
        content: "Python is a powerful language...",
        category: createdCategories[1]._id,
        author: admin?._id,
        slug: slugify("Exploring Python for Data Science", { lower: true }),
      },
      {
        title: "Java: The Enterprise Language",
        content: "Java remains a popular language...",
        category: createdCategories[2]._id,
        author: admin?._id,
        slug: slugify("Java: The Enterprise Language", { lower: true }),
      },
      {
        title: "C++ for High Performance",
        content: "C++ is known for its performance...",
        category: createdCategories[3]._id,
        author: admin?._id,
        slug: slugify("C++ for High Performance", { lower: true }),
      },
      {
        title: "Getting Started with Ruby",
        content: "Ruby is a dynamic language...",
        category: createdCategories[4]._id,
        author: admin?._id,
        slug: slugify("Getting Started with Ruby", { lower: true }),
      },
      {
        title: "Go: Concurrency Made Easy",
        content: "Go simplifies concurrent programming...",
        category: createdCategories[5]._id,
        author: admin?._id,
        slug: slugify("Go: Concurrency Made Easy", { lower: true }),
      },
      {
        title: "Swift for iOS Development",
        content: "Swift is the language of choice...",
        category: createdCategories[6]._id,
        author: admin?._id,
        slug: slugify("Swift for iOS Development", { lower: true }),
      },
      {
        title: "PHP: The Web's Workhorse",
        content: "PHP powers many websites...",
        category: createdCategories[7]._id,
        author: admin?._id,
        slug: slugify("PHP: The Web's Workhorse", { lower: true }),
      },
      {
        title: "Building Applications with C#",
        content: "C# is a versatile language...",
        category: createdCategories[8]._id,
        author: admin?._id,
        slug: slugify("Building Applications with C#", { lower: true }),
      },
      {
        title: "Rust: Safety and Speed",
        content: "Rust provides memory safety...",
        category: createdCategories[9]._id,
        author: admin?._id,
        slug: slugify("Rust: Safety and Speed", { lower: true }),
      },
    ];

    await Blog.insertMany(blogs);
    console.log("Blogs seeded");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
