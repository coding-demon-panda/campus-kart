const Listing = require("../models/listing");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "listings", // Name of the folder in Cloudinary where the images will be stored
    allowedFormats: ["jpeg", "png", "jpg"], // Accepted formats
  },
});

const upload = multer({ storage });

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    let {id} = req.params;
    
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // If an image is uploaded, add the Cloudinary URL to the listing
        if (req.file) {
            newListing.image = {
                url: req.file.path, // Cloudinary file path (URL)
                filename: req.file.filename, // Unique Cloudinary file identifier
            };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {listing});
    }
    catch (err) {
        next(err);
    }
};

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (req.file) {
        // Delete the old image from Cloudinary if needed
        if (listing.image && listing.image.public_id) {
            await cloudinary.uploader.destroy(listing.image.public_id);
        }
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "listings"
        });
        req.body.listing.image = {
            url: result.secure_url,
            public_id: result.public_id
        };
    } else {
        // If no new image is uploaded, keep the existing image
        req.body.listing.image = listing.image;
    }

    // Update the listing with new data
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};