const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId  } = require('mongodb');
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');

const jwt = require('jsonwebtoken');
const connectDB = require('./connection/connection');
const Product = require('./models/Product');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
const client = connectDB()

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qtxgu.mongodb.net/?retryWrites=true&w=majority`
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    console.log(err)
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }

    req.decoded = decoded;
    next();
    console.log(decoded)
  });
}
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// const motherboards = [
//   {
//       name: "MotherBoard with Desktop Board H81 Socket LGA",
//       image: "https://m.media-amazon.com/images/I/71iVHPmEfZL._AC_SY355_.jpg",
//       description: "The motherboard has H81 Socket.It is long durable",
//       minimumQuantity: 100,
//       availableQuantity: 500,
//       price: 500
//   },
//   {
//       name: "Motherboard-Graphics-High-Speed-Interface-Mainboar",
//       image: "https://m.media-amazon.com/images/I/81Ul7vu6ZDL._AC_SY355_.jpg",
//       description: "USB3.0 high-speed interface: front and rear dual-position, dual USB3.0 interface, high transmission rate",
//       minimumQuantity: 100,
//       availableQuantity: 1000,
//       price: 600
//   },
//   {
//       name: "WiFi Gundam Edition, LGA 1200 (Intel 11th/10th Gen) ATX Gaming Motherboard",
//       image: "https://m.media-amazon.com/images/I/8173cHt58NL._AC_SX522_.jpg",
//       description: "Intel LGA 1200 socket: Ready for 11th and 10th Gen Intel Core processors",
//       minimumQuantity: 100,
//       availableQuantity: 1000,
//       price: 700
//   }
// ];

// Product.insertMany(motherboards)
//   .then(docs => {
//       console.log('Data inserted successfully:', docs);
//       // mongoose.connection.close();
//   })
//   .catch(err => {
//       console.error('Error inserting data:', err);
//       // mongoose.connection.close();
//   });
async function run(){
    try{
        await client.connect();
        const partCollection = client.db('computer-manufacturer').collection('part');
        const reviewCollection = client.db('computer-manufacturer').collection('review');
        const userCollection = client.db('computer-manufacturer').collection('users');
        const orderCollection = client.db('computer-manufacturer').collection('order');  
        const paymentCollection = client.db('computer-manufacturer').collection('payment');  
        const serviceCollection = client.db('computer-manufacturer').collection('service');
        const professionalCollection = client.db('computer-manufacturer').collection('professional');
          
          
      
       

        // app.get('/part', async (req, res) => {
        //   const query = {};
        //   const cursor = partCollection.find(query);
        //   const part = await cursor.toArray();
        //   res.send(part);
        // }); 
        // app.get('/review', async (req, res) => {
        //   const query = {};
        //   const cursor = reviewCollection.find(query);
        //   const review = await cursor.toArray();
        //   res.send(review);
        // }); 
        // app.get('/service', async (req, res) => {
        //   const query = {};
        //   const cursor = serviceCollection.find(query);
        //   const service = await cursor.toArray();
        //   res.send(service);
        // }); 
        app.get('/professional', async (req, res) => {
          const query = {};
          const cursor = professionalCollection.find(query);
          const professional = await cursor.toArray();
          res.send(professional);
        }); 


//admin

app.get('/admin/:email', verifyJWT,verifyAdmin, async (req, res) => {
  const email = req.params.email;
  const user = await userCollection.findOne({ email: email });
  const isAdmin = user.role === 'admin';
  res.send({ admin: isAdmin })
})
// admin roll setter
app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const updateDoc = {
    $set: { role: 'admin' },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
})
//put user additional info
app.put('/userUpdate/:email', verifyJWT, async (req, res) => {
  const email = req.params.email;
  const profile=req.body;
  const filter = { email: email };
  const updateDoc = {
    $set: { 
      name:profile.name,
      education:profile.education,
      location:profile.location,
      phone:profile.phone,
      linkedin:profile.linkedin
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
  console.log(result);
})
//available quantiy update
app.put('/purchaseUpdate/:id', verifyJWT, async (req, res) => {
  const id = req.params.id;
  const data=req.body;
console.log(data)

  const filter =   { _id: ObjectId(id) }; 
  const updateDoc = {
    $set: { 
      availableQuantity:data.availables
    },
  };
  const result = await partCollection.updateOne(filter, updateDoc);
  res.send(result);
  console.log(result);
})


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
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
      res.send({ result, token });
    })

//payment

app.post('/create-payment-intent', verifyJWT, async(req, res) =>{
  const service = req.body;
  const price = service.price;
  const amount = price*100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount : amount,
    currency: 'usd',
    payment_method_types:['card']
  });
  res.send({clientSecret: paymentIntent.client_secret})
});
app.get('/order',verifyJWT, async (req, res) => {
  const query = {};
  const cursor = orderCollection.find(query);
  const part = await cursor.toArray();
  res.send(part);
}); 
    //purschase
  //   app.get('/part/:id',verifyJWT, async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: ObjectId(id) };
  //     const part = await partCollection.findOne(query);
  //     res.send(part);
  // });

  app.post('/purchase', verifyJWT, async (req, res) => {
    const purchase = req.body;
   
    const result = await orderCollection.insertOne(purchase);

    return res.send({ success: true, result });
  });
//order one by id
app.get('/order/:id',verifyJWT, async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const order = await orderCollection.findOne(query);
  res.send(order);
});
//admin put shipped
app.put('/order/:id',verifyJWT,verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  
  const updateDoc = {
    $set: { status: 'shipped' },
  };
  const result = await orderCollection.updateOne(filter, updateDoc);
  res.send(result);
})

//payment update
app.patch('/order/:id', verifyJWT, async(req, res) =>{
  const id  = req.params.id;
  const payment = req.body;
  const filter = {_id: ObjectId(id)};
  const updatedDoc = {
    $set: {
      paid: true,
      transactionId: payment.transactionId
    }
  }

  const result = await paymentCollection.insertOne(payment);
  const updatedBooking = await orderCollection.updateOne(filter, updatedDoc);
  res.send(updatedBooking);
})


app.get('/user', verifyJWT,verifyAdmin, async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
});
app.get('/user/:email',verifyJWT, async (req, res) => {
  const email = req.params.email;
  const query={email:email}
  const users = await userCollection.findOne(query);
  res.send(users);
});
//delete order
app.delete('/order/:id', verifyJWT, async (req, res) => {
  const id  = req.params.id;
  const filter = {_id: ObjectId(id)};
  const result = await orderCollection.deleteOne(filter);
  res.send(result);
})

//delete part
app.delete('/part/:id', verifyJWT,verifyAdmin, async (req, res) => {
  const id  = req.params.id;
  const filter = {_id: ObjectId(id)};
  const result = await partCollection.deleteOne(filter);
  res.send(result);
  console.log(result);
})


//review add
// app.post('/review', verifyJWT, async (req, res) => {
//   const review = req.body;
//   const result = await reviewCollection.insertOne(review);
//   res.send(result);
// });
//admin add part
app.post('/part', verifyJWT, verifyAdmin,async (req, res) => {
  const part = req.body;
  const result = await partCollection.insertOne(part);
  res.send(result);
});

//my order
app.get('/myorder', verifyJWT, async (req, res) => {
  const userMail = req.query.email;
  const decodedEmail = req.decoded.email;
  if (userMail === decodedEmail) {
    const query = { email: userMail };
    const order = await orderCollection.find(query).toArray();
    return res.send(order);
  }
  else {
    return res.status(403).send({ message: 'forbidden access' });
  }
})

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