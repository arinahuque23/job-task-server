const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.yg1cktm.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const jobCollection = client.db("TaskManager").collection("projects");

    app.post("/projects", async (req, res) => {
      const data = req.body;
      const result = await jobCollection.insertOne(data);
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const result = await jobCollection.find().toArray();
      res.send(result);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.find(query);
      res.send(result);
    });

    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {
        _id: new ObjectId(id),
      };
      const option = { upsert: true };
      const updateData = {
        $set: {
          title: data.title,
          description: data.description,
          priority: data.priority,
        },
      };
      const result = await jobCollection.updateOne(
        filter,
        updateData,
        option
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TODO Management Server is running");
});

app.listen(port, () => {
  console.log(`todo app listening on Port ${port}`);
});
