const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const PORT = 3000;
const app = express();

// DB Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Models
const Fruit = require('./models/fruit');

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/fruits', async (req, res) => {
  const msg = req.query.msg;

  console.log(msg);
  const fruits = await Fruit.find();

  res.render('fruits/index.ejs', { fruits, msg });
});

app.get('/fruits/new', (req, res) => {
  res.render('fruits/new.ejs');
});

app.get('/fruits/:fruitId/edit', async (req, res) => {
  const fruitId = req.params.fruitId;

  const fruit = await Fruit.findById(fruitId);
  res.render('fruits/edit.ejs', { fruit });
});

app.get('/fruits/:fruitId', async (req, res) => {
  const fruitId = req.params.fruitId;

  const fruit = await Fruit.findById(fruitId);
  res.render('fruits/show.ejs', { fruit });
});

app.post('/fruits', async (req, res) => {
  console.log(req.body);
  if (req.body.isReadyToEat === 'on') {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  await Fruit.create(req.body);

  res.redirect('/fruits');
});

app.delete('/fruits/:fruitId', async (req, res) => {
  const fruitId = req.params.fruitId;

  await Fruit.findByIdAndDelete(fruitId);

  res.redirect('/fruits?msg="record deleted"');
});

app.put('/fruits/:fruitId', async (req, res) => {
  console.log(req.body);
  if (req.body.isReadyToEat === 'on') {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  const fruitId = req.params.fruitId;

  await Fruit.findByIdAndUpdate(fruitId, req.body);

  res.redirect(`/fruits/${fruitId}`);
});

app.listen(PORT, () => {
  console.log('Listening on port 3000');
}); 