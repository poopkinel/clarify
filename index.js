const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app..listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${PORT}`);
});

