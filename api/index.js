import dotenv from "dotenv";
import cors from "cors";
import Express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PWD}@cluster0.ifnuqvn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = Express();
app.use(cors());

// Only run the server once MongoDB is connected
client.connect().then(() => {
  console.log("Connected to MongoDB!");

  // Simple route
  app.get("/api/hello/", (req, res) => {
    res.json({
      message: "Hello World"
    });
  });

  // Get the data from mongoDB
  app.get("/api/read_mongodb/", (req, res) => {
    client.db("sample_mflix").collection("comments").find({}).limit(10).toArray()
      .then(results => {
        res.json({
          message: "Data fetched successfully",
          data: results
        });
      })
      .catch(error => {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).json({ message: "Failed to fetch data", error });
      });
  });

  app.listen(8000, () => {
    console.log("Server running on port 8000");
  });

}).catch(err => {
  console.error("MongoDB connection failed:", err);
});
