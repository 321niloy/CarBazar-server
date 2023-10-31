const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.post || 5000
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
var cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);





app.use(cors())
app.use(express.json())


console.log(`apikey`,process.env.STRIPE_SECRET_KEY)// get it in console


const uri = `mongodb://${process.env.ADMIN_USER}:${process.env.ADDMIN_PASS}@ac-mvazqsy-shard-00-00.hpy6sqt.mongodb.net:27017,ac-mvazqsy-shard-00-01.hpy6sqt.mongodb.net:27017,ac-mvazqsy-shard-00-02.hpy6sqt.mongodb.net:27017/?ssl=true&replicaSet=atlas-vll8ae-shard-0&authSource=admin&retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("CarsBazar");
    const carcollections = database.collection("allcars");
    const usersCollection = client.db("CarsBazar").collection("users");
    const getCollection = client.db("CarsBazar").collection("getcars");
    const paymentCollection = client.db("CarsBazar").collection("payments");
    const testimonialCollection = client.db("CarsBazar").collection("testimonial");
    const feedbackCollection = client.db("CarsBazar").collection("feedback");
    const flowchartCollection = client.db("CarsBazar").collection("flowchart");


    // users start
    app.put('/users/:email', async(req,res)=>{
      const email = req.params.email
      const user = req.body
     
      const query = {email:email}
      const options = {upsert: true }
      const updateDoc = {
          $set:user
      }
      const result =await usersCollection.updateOne(query,updateDoc,options)
      res.send(result)
  })


    // users end

    // get users
    app.get("/users",async(req,res)=>{
      const allusers = await usersCollection.find().toArray()
      res.send(allusers)
    })
    //get users end=====================

    // get users delete
    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })

    // get users delete end------

    // testimonial all get start
    app.get('/testimonial', async(req,res)=>{
      const alldata = await testimonialCollection.find().toArray()
      res.send(alldata)
     
    })

    // testimonial end

    // testimonial Post
    app.post('/testimonial', async (req, res) => {
      const newItem = req.body;
        const result = await  testimonialCollection.insertOne(newItem);
        res.send({ message: 'Success Fully posted', result});
  });
    // Testimonial post End

    // testimonial delete

    app.delete('/testimonial/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await testimonialCollection.deleteOne(query);
      res.send(result)
    })

    // Testimonial delete


    // Testimonial single data
    app.get('/testimonial/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testimonialCollection.findOne(query);
      res.send(result);
  });
    // Testimonial single data end

    //testimonial  start update
   app.put('/testimonial/:id', async(req,res) =>{
    const id = req.params.id;
    const updatetestimonial = req.body
    console.log("Updatetestimonial",updatetestimonial)
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const update = {
        $set: {
          name:updatetestimonial.name,
          details:updatetestimonial.details,
          position:updatetestimonial.position,
    
          ...(updatetestimonial.image && { image: updatetestimonial.image }), 
        },
      };
      const result = await testimonialCollection.updateOne(filter, update, options);
      res.send(result)
 })
// testimonial end update

    app.get('/allcars/:text', async(req,res)=>{
      console.log(req.params.text)
    if(req.params.text === 'lowtohigh'){
      const cursor = await carcollections.find().sort({price: 1}).toArray()
      res.send(cursor)
    }
    else if(req.params.text === 'hightolow'){
      const cursor = await carcollections.find().sort({price: -1}).toArray()
      res.send(cursor)
    }
    else if(req.params.text === 'topsell'){
      const cursor = await carcollections.find().sort({sell: -1}).toArray()
      res.send(cursor)
    }
    else{
      const cursor = await carcollections.find().toArray()
      res.send(cursor)
    }
  
    
     
     
    })

    // ---allcars single get collection
    app.get('/allcars/text/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carcollections.findOne(query);
      res.send(result);
  });

    // end it 

    // Add Cars------------
    app.post('/addcars', async (req, res) => {
      const newItem = req.body;
        const result = await  carcollections.insertOne(newItem);
        res.send({ message: 'Success Fully added', result});
  });

    // add cars end--------
    // UPDATE CARS
    app.put('/allcars/text/:id', async(req,res) =>{
      const id = req.params.id;
      const updatecars = req.body
      console.log("Updatetestimonial",updatecars)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
          $set: {
            name:updatecars.name,
            model:updatecars.model,
            price:updatecars.price,
            ...(updatecars.image && { image: updatecars.image }), 
            madeIn:updatecars.madeIn,
            rating:updatecars.rating,
            sell:updatecars.sell,
            available:updatecars.available
          },
        };
        const result = await carcollections.updateOne(filter, update, options);
        res.send(result)
   })
    // UPDATE CARS END
    // cars delete
    app.delete('/allcars/text/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await carcollections.deleteOne(query);
      res.send(result)
    })
    // cars delete end

    app.post('/getcars', async (req, res) => {
        const newItem = req.body;
        console.log(newItem);
    
        // Check if the data exists in the collection
        const existingItem = await getCollection.findOne(newItem);
        if (existingItem) {
          // If the data already exists, send a response indicating that it was not posted
          res.send({ message: 'Already Get This Car' });
        } else {
          // If the data does not exist, insert it into the collection
          const result = await getCollection.insertOne(newItem);
          res.send({ message: 'Success Fully Selacted', result});
        }
    });

// --------------------feedback post 
    app.post('/feedback', async (req, res) => {
      const newItem = req.body;
      // console.log("feedback",newItem);
        // If the data does not exist, insert it into the collection
        const result = await feedbackCollection.insertOne(newItem);
        res.send({ message: 'Success Fully Selacted', result});
  });

  //----------------------- end
  // feed get

  app.get('/feedback', async(req,res)=>{
    const alldata = await feedbackCollection.find().toArray()
    res.send(alldata)
   
  })

  // -------------------
// feed delete

  app.delete('/feeddelete/:id', async(req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await feedbackCollection.deleteOne(query);
    res.send(result)
  })

  // feed delete


   
    app.get('/getcars', async(req,res)=>{
    const email = req.query.email;
    const query = { email: email }; // Create a query object
    const cursor = await getCollection.find(query).toArray();
    res.send(cursor)
    })

    app.get('/singlegetcars/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await getCollection.findOne(query);
      res.send(result);
  });

    app.delete('/getcars/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await getCollection.deleteOne(query);
      res.send(result)
    })

    // Create Payment intent
    app.post("/PaymentPost", async (req, res) => {
      const { total } = req.body;
      const amount = parseInt(total*100);
      console.log("kkr",total,amount)
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ['card'],
      });
      // console.log({paymentIntent})
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });


    // Create Payment intent End
 

    // Assuming `paymentCollection` and `getCollection` are properly defined
    
    app.post('/payments', async (req, res) => {

       // Insert the payment document
        const payment = req.body;
        console.log("payments", payment);
        const result = await paymentCollection.insertOne(payment);
        // Insert the payment document
    
  // Assuming id is available in the request body ---delete one start
        const id = req.body.carid;
        const query = { _id: new ObjectId(id) };
        const equal = await getCollection.deleteOne(query);
    // Perform the deleteOne operation on the correct collection
// update one 

const objectId = req.body.objectId;
const filter = { _id: new ObjectId(objectId) };
const options = { upsert: true };
const update = ({ $inc: { sell: 1, available: -1 }});
const resultIncreaseDecrease = await carcollections.updateOne(filter, update, options);

// update end
        // Send the responses separately
        res.send({ result, equal,resultIncreaseDecrease });
    });

    // flowchart  data by email
  
    app.get('/payment', async(req,res)=>{
      const email = req.query.email;
      const query = { email: email }; // Create a query object
      const cursor = await paymentCollection.find(query).toArray();
      res.send(cursor)
      })

    // 
    

// flowchart data get
app.get("/flowchart",async(req,res)=>{
  const allusers = await flowchartCollection.find().toArray()
  res.send(allusers)
})

// flowchart data end




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('CarBazar in Bangladesh')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})