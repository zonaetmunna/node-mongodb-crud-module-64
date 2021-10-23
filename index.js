const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// user name and password database
// user : mongodbuser1
// pass :1FnI9yyV7KinidKA

// database
const uri = "mongodb+srv://mongodbuser1:1FnI9yyV7KinidKA@cluster0.fuuny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
     try {
          await client.connect();
          const database = client.db("insertDB");
          const userCollection = database.collection("users");
          // get api
          app.get('/users', async (req, res) => {
               const cursor = userCollection.find({});
               const users = await cursor.toArray();
               res.send(users);
          })

          // find
          app.get('/users/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await userCollection.findOne(query);

               console.log('load user with id', id);
               res.send(user);
          })

          // post api
          app.post('/users', async (req, res) => {
               const newUser = req.body;
               const result = await userCollection.insertOne(newUser);
               console.log('got new user', req.body);
               console.log('added user', result);
               res.send(result)
          })



          // delete api
          app.delete('/users/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await userCollection.deleteOne(query);
               console.log('deleted user id', result);
               res.json(result);
          })

          // update
          app.put('/users/:id', async (req, res) => {
               const id = req.params.id;
               const updatedUser = req.body;
               const filter = { _id: ObjectId(id) };
               const option = { upsert: true };
               const updateDocument = {
                    $set: {
                         name: updatedUser.name,
                         email: updatedUser.email
                    },
               };
               const result = await userCollection.updateOne(filter, updateDocument, option);
               res.json(result);

          })

     } finally {
          // await client.close();
     }
}
run().catch(console.dir);



app.get('/', (req, res) => {
     res.send('node mongodb crud');
})


// port lister
app.listen(port, () => {
     console.log('listing is in port', port);
})