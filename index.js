const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connection with database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znerx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database requests
async function run() {
  try {
    await client.connect();
    const database = client.db("ocular-optics-database");
    const products = database.collection("products");
    const orders = database.collection("orders");
    const users = database.collection("users");

    app.get("/products", async (req, res) => {
      const cursor = products.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/my-orders", async (req, res) => {
      const cursor = orders.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/place-order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await products.findOne(query);
      res.json(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await products.findOne(query);
      res.json(result);
    });

    app.post("/add-new-product", async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.json(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orders.deleteOne(query);
      res.json(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          orderStatus: "Approved",
        },
      };
      const result = await orders.updateOne(query, updateDoc);
      res.json(result);
    });

    app.post("/new-order", async (req, res) => {
      const newOrder = req.body;
      console.log(newOrder);
      const result = await orders.insertOne(newOrder);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await users.insertOne(newOrder);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.listen(port, () => {
  console.log("Listening on port", port);
});
