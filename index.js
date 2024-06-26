const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://radar-weather.netlify.app'  
    ],
    methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d7bt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
        const favouriteListCollection = client.db('radar-server').collection('favouriteList');

        app.get('/favouriteList', async (req, res) => {
            const result = await favouriteListCollection.find().toArray();
            res.send(result);
        })

        app.get('/favouriteList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await favouriteListCollection.findOne(query);
            res.send(result);
        })

        app.post('/favouriteList', async (req, res) => {
            const favouriteOne = req.body;
            const result = await favouriteListCollection.insertOne(favouriteOne);
            res.send(result);
        })

        app.delete('/favouriteList/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await favouriteListCollection.deleteOne(query);
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Radar server is running')
})

app.listen(port, () => {
    console.log(`Radar server running on port ${port}`)
})