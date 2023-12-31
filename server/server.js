require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const colors = require('colors')
const api = require('./api');
const { checkCategories } = require('./utils/predefinedCategories')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/api/', api);

if (process.env.NODE_ENV === 'production'){

    app.use(express.static(path.join(__dirname, '/build')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/build/index.html'))
    });
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async (connection) => {
  console.log("Connected to", colors.blue(`MongoDB`))
  await checkCategories()
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port`, colors.blue(`${PORT}`));
});