require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('connected', () => {
    console.log('MongoDB connected successfully');
});
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

const product = new mongoose.Schema({
    title: String,
    language: String,
    genre: [String],
    comment: String,
    createdDate: String
});

const ProductInfo = mongoose.model('product', product);

app.get('/product', async (req, res) => {
    console.log('Requesting...GET /product');
    console.log("----------------------------");
    try {
        const response = await ProductInfo.find();
        console.log(response);
        console.log("----------------------------");
        res.json(response);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/product', async (req, res) => {
    console.log('Requesting...POST /product');
    console.log("----------------------------");
    console.log(req.body);
    console.log("----------------------------");
    const {title, language, genre, comment, createdDate} = req.body;
    const newProduct = new ProductInfo({title, language, genre, comment, createdDate});
    try {
        let r = await newProduct.save();
        console.log(JSON.stringify(r, null, 2));
        console.log("----------------------------");
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
