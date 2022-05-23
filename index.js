const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId  } = require('mongodb');

const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qtxgu.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}


async function run(){
    try{
        await client.connect();
        const partCollection = client.db('computer-manufacturer').collection('part');
        const reviewCollection = client.db('computer-manufacturer').collection('review');
        const userCollection = client.db('computer-manufacturer').collection('users');
        const orderCollection = client.db('computer-manufacturer').collection('order');  
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

     //put user 
     app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.send({ result, token });
    })

    //purschase
    app.get('/part/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const part = await partCollection.findOne(query);
      res.send(part);
  });

  app.post('/purchase', async (req, res) => {
    const purchase = req.body;
   
    const result = await orderCollection.insertOne(purchase);

    return res.send({ success: true, result });
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