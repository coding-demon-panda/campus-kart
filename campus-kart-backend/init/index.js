if (process.env.NODE_ENV !== 'production') {
    const path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;

// Cloudinary configuration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const MONGO_URL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Function to upload images to Cloudinary
const uploadToCloudinary = async (imageUrl) => {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: 'listings'
        });
        return result.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null; // Handle the error appropriately
    }
};

const initDB = async () => {
    // await Listing.deleteMany({});

    // Loop through all listings and upload their images to Cloudinary
    const updatedListings = await Promise.all(
        initData.data.map(async (listing) => {
            const cloudinaryUrl = await uploadToCloudinary(listing.image);
            return {
                ...listing,
                image: { url: cloudinaryUrl }, // Update image with Cloudinary URL
                owner: "66fc2a18b90df313b48ca417",
            };
        })
    );

    // Insert updated listings into the database
    await Listing.insertMany(updatedListings);
    console.log("Data was initialized with Cloudinary images");
};

initDB();
