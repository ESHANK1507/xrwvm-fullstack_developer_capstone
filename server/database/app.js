/* jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const resolveDataPath = (filename) => {
  const localPath = path.join(__dirname, filename);
  if (fs.existsSync(localPath)) {
    return localPath;
  }
  return path.join(__dirname, 'data', filename);
};

const reviews_data = JSON.parse(
  fs.readFileSync(resolveDataPath('reviews.json'), 'utf8')
);
const dealerships_data = JSON.parse(
  fs.readFileSync(resolveDataPath('dealerships.json'), 'utf8')
);

const Reviews = require('./review');
const Dealerships = require('./dealership');

let useMongo = false;
const localReviews = reviews_data.reviews.slice();
const localDealerships = dealerships_data.dealerships.slice();

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo_db:27017/';
mongoose
  .connect(mongoUrl, {
    dbName: 'dealershipsDB',
    serverSelectionTimeoutMS: 2000,
  })
  .then(async () => {
    useMongo = true;
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);
    console.log('Connected to MongoDB and seeded collections');
  })
  .catch(() => {
    useMongo = false;
    console.log('MongoDB unavailable; serving local JSON datasets in memory');
  });

// Express route to home
app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    if (useMongo) {
      const documents = await Reviews.find();
      return res.json(documents);
    }
    return res.json(localReviews);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    if (useMongo) {
      const documents = await Reviews.find({ dealership: req.params.id });
      return res.json(documents);
    }
    const dealerId = Number(req.params.id);
    const documents = localReviews.filter((r) => r.dealership === dealerId);
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    if (useMongo) {
      const documents = await Dealerships.find();
      return res.json(documents);
    }
    return res.json(localDealerships);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    if (useMongo) {
      const documents = await Dealerships.find({ state: req.params.state });
      return res.json(documents);
    }
    const documents = localDealerships.filter(
      (d) => d.state.toLowerCase() === req.params.state.toLowerCase()
    );
    return res.json(documents);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error fetching dealerships by state' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    if (useMongo) {
      const documents = await Dealerships.find({ id: req.params.id });
      return res.json(documents);
    }
    const dealerId = Number(req.params.id);
    const documents = localDealerships.filter((d) => d.id === dealerId);
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching dealer by id' });
  }
});

// Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  const data = JSON.parse(req.body);

  if (useMongo) {
    const documents = await Reviews.find().sort({ id: -1 });
    const new_id = documents.length > 0 ? documents[0].id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    try {
      const savedReview = await review.save();
      return res.json(savedReview);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error inserting review' });
    }
  }

  const maxId = localReviews.reduce((max, r) => (r.id > max ? r.id : max), 0);
  const savedReview = {
    id: maxId + 1,
    name: data.name,
    dealership: Number(data.dealership),
    review: data.review,
    purchase: Boolean(data.purchase),
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: Number(data.car_year),
  };
  localReviews.push(savedReview);
  return res.json(savedReview);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
