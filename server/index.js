const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRouter = require('./src/routes/auth');
const accountRouter = require('./src/routes/accounts');
const guestsRouter = require('./src/routes/guests');
const eventRouter = require('./src/routes/events');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/guests', guestsRouter);
app.use('/api/v1/events', eventRouter);
app.all('*', (req, res) => {
  res.status(404).send('Path not found!');
});

app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
