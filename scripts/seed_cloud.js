const mongoose = require('mongoose');
const User = require('../src/models/users');
const Ad = require('../src/models/ads');

// Get DB_URL from command line argument
const DB_URL = process.argv[2];

if (!DB_URL) {
    console.error("Please provide the connection string as an argument.");
    console.error("Usage: node scripts/seed_cloud.js <YOUR_CONNECTION_STRING>");
    process.exit(1);
}

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Cloud successfully.");
    seedData();
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const locations = [
    "Kattakada",
    "Varkala",
    "Nedumangadu",
    "Neyyattinkara",
    "Thrivandram",
    "Kazhakkoottam"
];

const images = [
    "house1.jpg",
    "house2.jpg",
    "house3.jpg",
    "house4.jpg",
    "house5.jpg",
    "house6.jpg",
    "ekm1.jpg",
    "klm1.jpg",
    "khm3.jpg",
    "tvm3.jpg"
];

const dummyUsers = [
    { name: "John Doe", email: "john@example.com", password: "password123", number: "9876543210" },
    { name: "Jane Smith", email: "jane@example.com", password: "password123", number: "9876543211" },
    { name: "Admin Test", email: "admin@test.com", password: "password123", number: "9876543212" }
];

async function seedData() {
    try {
        // Create Users first if they don't exist
        console.log("Creating/Checking Users...");
        const users = [];
        for (const u of dummyUsers) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
                console.log(`Created user: ${user.name}`);
            } else {
                console.log(`User exists: ${user.name}`);
            }
            users.push(user);
        }

        console.log("Creating Ads...");
        const ads = [];

        // Create 2-3 ads per location
        for (const loc of locations) {
            for (let i = 0; i < 3; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomImage = images[Math.floor(Math.random() * images.length)];

                ads.push({
                    title: `Beautiful House in ${loc}`,
                    description: `A lovely ${i + 2}BHK house located in the heart of ${loc}. Close to amenities.`,
                    location: loc,
                    price: 15000 + (Math.random() * 10000), // Random price between 15k and 25k
                    image: randomImage,
                    user: randomUser._id,
                    status: "approved",
                    bedrooms: i + 2,
                    bathrooms: i + 1,
                    squareFeet: 1200 + (i * 200)
                });
            }
        }

        await Ad.insertMany(ads);
        console.log(`Successfully added ${ads.length} new ads across all locations!`);
        console.log("Done! Press Ctrl+C to exit if it doesn't close automatically.");
        process.exit(0);

    } catch (e) {
        console.error("Error seeding data:", e);
        process.exit(1);
    }
}
