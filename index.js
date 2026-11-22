// index.js - Express todo service backed by a local MongoDB instance.
const express = require('express');
const { MongoClient } = require('mongodb');

const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const app = express();
const client = new MongoClient(MONGO_URL);
let db;

app.get('/todo', async (req, res) => {
  const todos = await db.collection('todos').find({}).toArray();
  res.json(todos);
});

app.get('/todo/:id', async (req, res) => {
  const todo = await db.collection('todos').findOne({ id: req.params.id });
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});

async function startServer() {
  await client.connect();
  db = client.db('todo');
  // Initialize the database with some sample data
  await db.collection('todos').deleteMany({});
  await db.collection('todos').insertMany([
    { id: '1', title: 'Buy groceries' },
    { id: '2', title: 'Install Docker' },
    { id: '3', title: 'Finish A9 observability' },
  ]);
  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
}

startServer().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
