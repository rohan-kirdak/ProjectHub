require("dotenv").config();
const mongoose = require("mongoose");
const { Category, ReadyProject, MiniProject, BundleProject, Roadmap } = require("./models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kanak_digifex_project_mart";

async function seedDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // 1. Seed Categories
        const countCategories = await Category.countDocuments();
        if (countCategories === 0) {
            await Category.insertMany([
                { name: "Web Development", image: "cat-web.jpg", price: 499.00, description: "HTML, CSS, JS, PHP projects", link: "/ready-project-details" },
                { name: "Mini Projects", image: "cat-mini.jpg", price: 299.00, description: "Small academic mini projects", link: "/mini-project-details" },
                { name: "Bundle Projects", image: "cat-bundle.jpg", price: 999.00, description: "Full package with docs, PPT, report", link: "/bundle-project-details" },
                { name: "AI / ML Projects", image: "cat-ai.jpg", price: 799.00, description: "Artificial Intelligence & Machine Learning", link: "/ai-projects" },
                { name: "Mobile Apps", image: "cat-mobile.jpg", price: 599.00, description: "Android & Flutter app projects", link: "/mobile-projects" },
                { name: "Full Stack Projects", image: "cat-fullstack.jpg", price: 699.00, description: "Complete frontend + backend projects", link: "/fullstack-projects" }
            ]);
            console.log("✅ Default categories seeded.");
        } else {
            console.log("ℹ️ Categories already exist, skipping category seed.");
        }

        console.log("🎉 Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding error:", err);
        process.exit(1);
    }
}

seedDB();
