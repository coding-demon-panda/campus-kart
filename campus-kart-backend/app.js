if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const userRouter = require("./routes/user");
const sellerProductsRouter = require('./routes/sellerProducts');
const studentRouter = require('./routes/student');
const productsRouter = require('./routes/products'); 
const cartRouter = require('./routes/cart'); 
const orderRouter = require('./routes/order');

const app = express();
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
      await mongoose.connect(dbUrl);
      console.log("MongoDB connected");
  } catch (err) {
      console.error("MongoDB connection error:", err);
  }
}

main();

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
  },
};

app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage(); // Store file in memory before upload
const upload = multer({ storage });

app.use(
  cors({
    origin: ["http://localhost:3000", "https://campus-kart-frontend.vercel.app", "http://*.localhost:3000", "https://*.campus-kart-frontend.vercel.app",], // Change as needed
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(session(sessionOptions));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }
        res.json({ imageUrl: result.secure_url });
      }
    ).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// User Routes
app.use("/", userRouter);
app.use("/seller", sellerProductsRouter);
app.use("/students", studentRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

// Handle Not Found
app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
