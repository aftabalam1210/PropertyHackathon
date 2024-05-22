const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/realestate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const propertySchema = new mongoose.Schema({
  googleLocation: String,
  brokerDetails: String,
  parcelSize: Number,
  pricePerAcre: Number,
  city: String,
  microMarket: String,
});

const Property = mongoose.model('Property', propertySchema);

app.post('/api/properties', async (req, res) => {
  const property = new Property(req.body);
  await property.save();
  res.send(property);
});

app.get('/api/properties', async (req, res) => {
  const properties = await Property.find();
  res.send(properties);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
