const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bababoey.nqekx8b.mongodb.net/?appName=Bababoey`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('Freelance');
    const jobCollection = db.collection("jobs");

    app.get('/jobs', async (req, res) => {
        
        const result = await jobCollection.find().toArray();
        
        res.send(result)
    })

    app.post('/jobs', async (req, res) => {
      const data = req.body;
      data.postedAt = new Date();
      const result = await jobCollection.insertOne(data)
      res.send({
        success: true,
        result
      })
    })
   
    app.get('/jobs/:id', async (req,res) => {
      const {id} = req.params
 
      const result = await jobCollection.findOne({_id: new ObjectId(id)});

      res.send(result)
    })

    //update
    app.put('/jobs/:id', async (req, res)=>{
      const {id} = req.params
      const data = req.body
      const objectId = new ObjectId(id)
      const filter = {_id: objectId}
      const update = {
        $set: data
      }
      const result = await jobCollection.updateOne(filter, update);

      res.send({
        success: true,
        result
      })
    })

    //delete
   app.delete('/jobs/:id', async (req,res)=> {
    const {id} = req.params
    
    const result = await jobCollection.deleteOne({_id: new ObjectId(id)})

    res.send({
      success: true,
    })
   })

    app.get('/latestJobs', async (req,res)=> {
      const result = await jobCollection.find().sort({postedAt: 'asc' }).limit(6).toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Working");
})

app.listen(port , ()=>{
    console.log(`Running at ${port}`);
})