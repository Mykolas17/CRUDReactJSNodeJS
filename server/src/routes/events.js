const express = require('express');
const joi = require('joi');
const mysql = require('mysql2/promise');

const isLoggedIn = require('../middleware/authorization');
// const jwt = require('jsonwebtoken');
const DB_CONFIG = require('../../config');
// const { date } = require('joi');

const router = express.Router();

const eventSchema = joi.object({
  name: joi.string().required(),
  date: joi.string().required(),
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.query(
      'SELECT e.id, e.name, e.date FROM `events` e'
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', isLoggedIn, async (req, res) => {
  const { name, date } = req.body;
  try {
    await eventSchema.validateAsync({ name, date });
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [response] = await connection.query(
      'INSERT INTO `events` (`name`,`date`) VALUES (?,?)',
      [name, date]
    );
    const eventData = {
      id: response.insertId,
      name,
      date,
    };
    await connection.end();
    return res.json(eventData);
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
