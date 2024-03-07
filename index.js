const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // ---------------------------------------------------All Post Operation-------------------------------------------------------------

        // api for post booking information 
        app.post('/booking', async(req, res) => {
            const newBooking = req.body;
            console.log(newBooking);
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result);
        });

        // api for post seats items 
        app.post('/seats', async(req, res) => {
            const newSeats = req.body;
            console.log(newSeats);
            const result = await seatsCollection.insertOne(newSeats);
            res.send(result)
        });
        // ---------------------------------------------------All get Operation-------------------------------------------------------------

        // api for get data from booking collection 
        app.get('/booking', async(req, res) => {
            const getData = bookingCollection.find();
            const result = await getData.toArray();
            res.send(result)
        })

        // api for get data from seat collection 
        app.get('/seats', async(req, res) => {
            const getSeats = seatsCollection.find();
            const result = await getSeats.toArray();
            res.send(result);
        });

        // ---------------------------------------------------All patch Operation-------------------------------------------------------------

        // api for update booking status in seat plan 
        app.patch('/seats', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateSeatInformation = req.body;
            console.log(updateSeatInformation);
        
            const updateDoc = {
                $set: {
                    status: updateSeatInformation.status
                }
            };
            const result = await seatsCollection.updateMany(filter, updateDoc);
            res.send(result);
        });








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