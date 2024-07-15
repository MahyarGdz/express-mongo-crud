// import mongoose from "mongoose";

// const mongoUri = process.env.MONGO_URI as string;

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(mongoUri);

//     console.log("Connected to MongoDB");

//     // Clear existing data
//     await Blog.deleteMany({});
//     await Category.deleteMany({});
//     await Admin.deleteMany({});

//     // Create Categories
//     const categories = [
//       { name: "Technology", link: "technology", description: "All about tech" },
//       { name: "Lifestyle", link: "lifestyle", description: "Lifestyle tips" },
//       { name: "Travel", link: "travel", description: "Travel stories" },
//     ];

//     const createdCategories = await Category.insertMany(categories);

//     // Create Admins
//     const admins = [
//       { email: "admin1@example.com", password: "password1", role: "admin", isActive: true },
//       { email: "admin2@example.com", password: "password2", role: "editor", isActive: true },
//     ];

//     // Hash passwords
//     for (const admin of admins) {
//       admin.password = await bcrypt.hash(admin.password, 10);
//     }

//     const createdAdmins = await Admin.insertMany(admins);

//     // Create Blogs
//     const blogs = [
//       {
//         title: "Tech Trends 2024",
//         slug: "tech-trends-2024",
//         content: "Latest trends in technology for 2024...",
//         imageUrl: "https://example.com/image1.jpg",
//         category: createdCategories[0]._id,
//         author: createdAdmins[0]._id,
//       },
//       {
//         title: "Healthy Living Tips",
//         slug: "healthy-living-tips",
//         content: "Tips for a healthy lifestyle...",
//         imageUrl: "https://example.com/image2.jpg",
//         category: createdCategories[1]._id,
//         author: createdAdmins[1]._id,
//       },
//       {
//         title: "Top Travel Destinations",
//         slug: "top-travel-destinations",
//         content: "Best places to travel in 2024...",
//         imageUrl: "https://example.com/image3.jpg",
//         category: createdCategories[2]._id,
//         author: createdAdmins[0]._id,
//       },
//     ];

//     await Blog.insertMany(blogs);

//     console.log("Database seeded!");
//     process.exit();
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   }
// };

// seedDatabase();
