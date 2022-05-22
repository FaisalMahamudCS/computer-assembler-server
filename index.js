const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qtxgu.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        await client.connect();
        const partCollection = client.db('computer-manufacturer').collection('part');
        const reviewCollection = client.db('computer-manufacturer').collection('review');
        app.get('/part', async (req, res) => {
          const query = {};
          const cursor = partCollection.find(query);
          const part = await cursor.toArray();
          res.send(part);
        }); 
        app.get('/review', async (req, res) => {
          const query = {};
          const cursor = reviewCollection.find(query);
          const review = await cursor.toArray();
          res.send(review);
        }); 

     
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Manufacturer App')
})

app.listen(port, () => {
  console.log(`Manufacturer is listening App listening on port ${port}`)
})