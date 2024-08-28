
const express = require('express');
const app = express();
const userRoutes = require('./apis/routes/user');

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
