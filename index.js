const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i9b8vs8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('genius-car').collection('services');
        const productCollection = client.db('genius-car').collection('products');
        const orders = client.db('genius-car').collection('orders');


        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/products', async(req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orders.insertOne(order);
            res.send(result);
        })
        app.get('/orders', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orders.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orders.deleteOne(query);
            res.send(result);
        })
        app.patch('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updateDoc = {
                $set:{
                    status: status,
                }
            }
            const result = await orders.updateOne(query, updateDoc);
            res.send(result);
        })


    }
    finally{

    }
}

run().catch(error => console.log(error))







app.get('/', (req, res) => {
    res.send('genius car server is running');
})
app.listen(port, () => console.log("genius car server is running"));