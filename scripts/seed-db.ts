import mongoose from "mongoose"
import dbConnect from "../lib/mongodb"
import Project from "../models/Project"
import User from "../models/User"

async function seedDatabase() {
  try {
    await dbConnect()
    console.log("Connected to MongoDB")

    // Clear existing data
    await Project.deleteMany({})
    await User.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminUser = new User({
      walletAddress: "0xadmin...1234",
      name: "Admin",
      fundBalance: 10000,
      solBalance: 100,
      stakedSol: 50,
    })
    await adminUser.save()
    console.log("Created admin user")

    // Create sample projects
    const projects = [
      {
        title: "Clean Water Initiative",
        description: "Providing clean water solutions to underserved communities.",
        longDescription:
          "Access to clean water is a fundamental human right, yet millions of people around the world lack this basic necessity. The Clean Water Initiative works to address this critical issue by implementing sustainable water solutions in communities facing water scarcity and contamination.",
        raised: 1250,
        goal: 5000,
        donors: 42,
        image: "/placeholder.svg?height=400&width=800",
        category: "Environment",
        createdBy: adminUser._id,
        updates: [
          {
            title: "Project Launch",
            content:
              "We're excited to announce the launch of our Clean Water Initiative campaign. Thanks to everyone who has supported us so far!",
            date: new Date("2025-03-15"),
          },
          {
            title: "First Milestone Reached",
            content:
              "We've reached our first funding milestone! This will allow us to begin preliminary work in our target communities.",
            date: new Date("2025-03-20"),
          },
        ],
      },
      {
        title: "Education for All",
        description: "Building schools and providing educational resources in rural areas.",
        longDescription:
          "Education is a powerful tool for change, yet many children in rural areas lack access to quality education. Our Education for All project aims to build schools, provide educational resources, and train teachers in underserved communities.",
        raised: 3400,
        goal: 10000,
        donors: 78,
        image: "/placeholder.svg?height=400&width=800",
        category: "Education",
        createdBy: adminUser._id,
        updates: [
          {
            title: "Project Launch",
            content:
              "We're thrilled to launch our Education for All campaign. Together, we can make education accessible to all children.",
            date: new Date("2025-03-10"),
          },
        ],
      },
      {
        title: "Renewable Energy Project",
        description: "Developing sustainable energy solutions for communities in need.",
        longDescription:
          "Climate change is one of the most pressing challenges of our time. Our Renewable Energy Project focuses on implementing sustainable energy solutions in communities that rely on fossil fuels, reducing carbon emissions and providing clean energy alternatives.",
        raised: 2100,
        goal: 7000,
        donors: 35,
        image: "/placeholder.svg?height=400&width=800",
        category: "Technology",
        createdBy: adminUser._id,
        updates: [
          {
            title: "Project Launch",
            content: "We're excited to launch our Renewable Energy Project. Join us in creating a sustainable future!",
            date: new Date("2025-03-05"),
          },
        ],
      },
    ]

    await Project.insertMany(projects)
    console.log("Created sample projects")

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seed function
seedDatabase()

