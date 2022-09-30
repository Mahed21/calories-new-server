const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pszjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
  try {
    await client.connect();
    const database = client.db("calories");
    const userCollection = database.collection("info");
    const calorieCollection = database.collection("calorie");
    console.log("connected");

    // User Start

    // Fecthing All User Data
    app.get("/information", async (req, res) => {
      const results = await userCollection.find({}).toArray();
      res.send(results);
    });

    // User End

    // Calorie Start

    // Fetching All Calorie Data
    app.get("/calorie", async (req, res) => {
      const results = await calorieCollection.find({}).toArray();
      res.send(results);
    });

    // Getting single Calorie data
    app.get('/calorie/:_id', async (req, res) => {
      const _id = req.params._id
      const query = { _id: ObjectId(_id) }
      const result = await calorieCollection.findOne(query)
      res.send(result)
    })

    // Adding New Calorie
    app.post('/calorie', async (req, res) => {
      const newCalorie = req.body
      const result = await calorieCollection.insertOne(newCalorie)
      res.send(result)
    })

    // Updating Calorie Data
    app.put('/calorie/:_id', async (req, res) => {
      const _id = req.params._id
      const updateCalorie = req.body;
      const query = { _id: ObjectId(_id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: updateCalorie,
      };
      const result = await calorieCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    })

    // Deleting Calorie
    app.delete('/calorie/:_id', async (req, res) => {
      const _id = req.params._id;
      const filter = { _id: ObjectId(_id) };
      const result = await calorieCollection.deleteOne(filter);
      res.send(result);
    })

    // Getting Calorie for an user
    app.get('/calories/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const yourCalorie = await calorieCollection.find(query).toArray()
      res.send(yourCalorie)
    })

    // Calorie End

    //console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
