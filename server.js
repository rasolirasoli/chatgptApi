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

// Furniture model
const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  
});

const Furniture = mongoose.model('Furniture', furnitureSchema);

// Routes

// Create a furniture item
app.post('/api/furniture', async (req, res) => {
  const { name, description, price } = req.body;
  const newFurniture = new Furniture({
    name, description, price
  });

  try {
    await newFurniture.save();
    res.status(201).json({ message: 'Furniture item created', furniture: newFurniture });
  } catch (error) {
    res.status(400).json({ message: 'Error creating furniture item', error: error.message });
  }
});

// Get all furniture items
app.get('/api/furniture', async (req, res) => {
  try {
    const furnitureItems = await Furniture.find();
    res.status(200).json(furnitureItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching furniture items', error: error.message });
  }
});

// Get a furniture item by ID
app.get('/api/furniture/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const furnitureItem = await Furniture.findById(id);
    if (furnitureItem) {
      res.status(200).json(furnitureItem);
    } else {
      res.status(404).json({ message: 'Furniture item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching furniture item', error: error.message });
  }
});

// Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});