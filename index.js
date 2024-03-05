const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config() // add for .env file access 
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.kdlxq0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("bus-ticket-booking");
        const bookingCollection = database.collection("booking");
        const seatsCollection = database.collection('seats');

        app.post('/booking', async(req, res) => {
            const newBooking = req.body;
            console.log(newBooking);
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result);
        });

        app.post('/seats', async(req, res) => {
            const newSeats = req.body;
            console.log(newSeats);
            const result = await seatsCollection.insertOne(newSeats);
            res.send(result)
        })

        app.get('/booking', async(req, res) => {
            const getData = bookingCollection.find();
            const result = await getData.toArray();
            res.send(result)
        })

        app.get('/seats', async(req, res) => {
            const getSeats = seatsCollection.find();
            const result = await getSeats.toArray();
            res.send(result);
        })












        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => { res.send('Bus Express Server Running') })

app.listen(port, () => { console.log(`Bus Ticket Booking Server ${port}`) })