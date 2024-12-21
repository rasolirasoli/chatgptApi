const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Food model
const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number
});

const Food = mongoose.model('Food', foodSchema);

// Routes

// Create a food item
app.post('/api/food', async (req, res) => {
  const { name, description, price } = req.body;
  const newFood = new Food({ name, description, price });

  try {
    await newFood.save();
    res.status(201).json({ message: 'Food item created', food: newFood });
  } catch (error) {
    res.status(400).json({ message: 'Error creating food item', error: error.message });
  }
});

// Get all food items
app.get('/api/food', async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food items', error: error.message });
  }
});

// Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});