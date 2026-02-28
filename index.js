const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a0ni9sf.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("quickhire");
    const jobsCollection = db.collection("jobs");
    const applicationCollection = db.collection("application");
    const usersCollection = db.collection("users");

    app.get("/api/jobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    app.get("/api/jobs/:id", async (req, res) => {
      const jobId = req.params;
      const result = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
      res.send(result);
    });

    app.post("/api/applications", async (req, res) => {
      const newApplication = req.body;
      const result = await applicationCollection.insertOne(newApplication);
      res.send(result);
    });

    app.get("/api/users/:email", async (req, res) => {
      try {
        const { email } = req.params; // Destructure the email from params
        const query = { email: email };

        const result = await usersCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    app.post("/api/users", async (req, res) => {
      const newUser = req.body;
      const { email } = newUser;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res
          .status(200)
          .json({ message: "User already exists", updated: true });
      }

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("QuickHire API is running...");
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
